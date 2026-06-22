// Verifies a 6-digit Zamtel OTP.
// On signup: creates the auth user (phone+password, phone_confirmed=true) and signs them in.
// On reset: updates the password for the user with that phone.
// Returns a fresh access_token + refresh_token the client uses to establish a session.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ZM_PHONE_REGEX = /^\+260\d{9}$/;
const DE_PHONE_REGEX = /^\+49\d{10,11}$/;
const MAX_ATTEMPTS = 5;

const PASSWORD_OK = (p: string) => p.length >= 8 && /[A-Z]/.test(p) && /\d/.test(p);

function jsonResponse(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizePhone(raw: string): string | null {
  const digits = (raw || "").replace(/[^\d+]/g, "");
  let c = digits;
  if (c.startsWith("00")) c = "+" + c.slice(2);
  if (c.startsWith("+49") || /^49\d+$/.test(c)) {
    if (!c.startsWith("+")) c = "+" + c;
    return DE_PHONE_REGEX.test(c) ? c : null;
  }
  if (c.startsWith("260")) c = "+" + c;
  else if (c.startsWith("0")) c = "+260" + c.slice(1);
  else if (!c.startsWith("+")) c = "+260" + c;
  return ZM_PHONE_REGEX.test(c) ? c : null;
}

function phoneLoginEmail(phone: string): string {
  return `phone-${phone.replace(/\D/g, "")}@phone.rasgoal.com`;
}

function samePhone(stored: string | undefined | null, normalized: string): boolean {
  return Boolean(stored) && stored!.replace(/\D/g, "") === normalized.replace(/\D/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const { phone: rawPhone, code, purpose, fullName, username, password, newPassword } = body || {};

    if (!purpose || (purpose !== "signup" && purpose !== "reset")) {
      return jsonResponse({ ok: false, error: "Invalid purpose" });
    }
    if (!code || !/^\d{6}$/.test(code)) {
      return jsonResponse({ ok: false, error: "Enter the 6-digit code." });
    }
    const phone = normalizePhone(rawPhone || "");
    if (!phone) {
      return jsonResponse({ ok: false, error: "Invalid phone number." });
    }

    const passToSet = purpose === "signup" ? password : newPassword;
    if (!passToSet || !PASSWORD_OK(passToSet)) {
      return jsonResponse({ ok: false, error: "Password must be at least 8 characters, include a number and an uppercase letter." });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: otpRow, error: otpErr } = await supabase
      .from("phone_otps")
      .select("*")
      .eq("phone", phone)
      .eq("purpose", purpose)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (otpErr) throw otpErr;
    if (!otpRow) {
      console.info("OTP verify rejected: no active code", { phone, purpose });
      return jsonResponse({ ok: false, error: "No active code. Please request a new one." });
    }
    if (new Date(otpRow.expires_at).getTime() < Date.now()) {
      await supabase.from("phone_otps").update({ consumed_at: new Date().toISOString() }).eq("id", otpRow.id);
      console.info("OTP verify rejected: expired code", { phone, purpose, otpId: otpRow.id });
      return jsonResponse({ ok: false, error: "Your code has expired. Please request a new one." });
    }
    if (otpRow.attempts >= MAX_ATTEMPTS) {
      await supabase.from("phone_otps").update({ consumed_at: new Date().toISOString() }).eq("id", otpRow.id);
      console.info("OTP verify rejected: too many attempts", { phone, purpose, otpId: otpRow.id });
      return jsonResponse({ ok: false, error: "Too many incorrect attempts. Please request a new code." });
    }

    const hash = await sha256Hex(code);
    if (hash !== otpRow.code_hash) {
      await supabase.from("phone_otps").update({ attempts: otpRow.attempts + 1 }).eq("id", otpRow.id);
      const remaining = MAX_ATTEMPTS - (otpRow.attempts + 1);
      console.info("OTP verify rejected: wrong code", { phone, purpose, otpId: otpRow.id, remaining });
      return jsonResponse({ ok: false, error: `Wrong code.${remaining > 0 ? ` ${remaining} attempt${remaining === 1 ? "" : "s"} left.` : ""}` });
    }

    // Mark consumed
    await supabase.from("phone_otps").update({ consumed_at: new Date().toISOString() }).eq("id", otpRow.id);

    if (purpose === "signup") {
      // Re-check uniqueness
      const loginEmail = phoneLoginEmail(phone);
      const { data: existingList, error: existingErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (existingErr) throw existingErr;
      const existingUser = existingList.users.find((u) =>
        u.email?.toLowerCase() === loginEmail ||
        u.user_metadata?.mobile_number === phone ||
        samePhone(u.phone, phone)
      );
      if (existingUser && (existingUser.email?.toLowerCase() === loginEmail || existingUser.user_metadata?.mobile_number === phone)) {
        return jsonResponse({ ok: false, error: "An account with this phone already exists. Please sign in." });
      }
      if (username) {
        const { data: takenUser } = await supabase.from("profiles").select("id,user_id").ilike("username", username).maybeSingle();
        if (takenUser && takenUser.user_id !== existingUser?.id) {
          return jsonResponse({ ok: false, error: "Username is already taken." });
        }
      }
      if (existingUser && samePhone(existingUser.phone, phone)) {
        const { error: migrateErr } = await supabase.auth.admin.updateUserById(existingUser.id, {
          email: loginEmail,
          password: passToSet,
          email_confirm: true,
          phone_confirm: true,
          user_metadata: { ...existingUser.user_metadata, full_name: fullName || null, username: username || null, mobile_number: phone, phone_verified: true },
        });
        if (migrateErr) throw migrateErr;
        const { error: profileErr } = await supabase
          .from("profiles")
          .update({ full_name: fullName || null, username: username || null, mobile_number: phone, updated_at: new Date().toISOString() })
          .eq("user_id", existingUser.id);
        if (profileErr) throw profileErr;
        console.log("Migrated phone user", existingUser.id);
      } else {
        const { data: created, error: createErr } = await supabase.auth.admin.createUser({
          email: loginEmail,
          password: passToSet,
          email_confirm: true,
          user_metadata: { full_name: fullName || null, username: username || null, mobile_number: phone, phone_verified: true },
        });
        if (createErr) throw createErr;
        console.log("Created phone user", created.user?.id);
      }
    } else {
      // Reset: find user by phone, update password
      const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (listErr) throw listErr;
      const loginEmail = phoneLoginEmail(phone);
      const user = list.users.find((u) => u.email?.toLowerCase() === loginEmail || u.user_metadata?.mobile_number === phone);
      if (!user) {
        return jsonResponse({ ok: false, error: "No account found for this phone number." });
      }
      const { error: updErr } = await supabase.auth.admin.updateUserById(user.id, { password: passToSet });
      if (updErr) throw updErr;
    }

    console.info("OTP verify ok", { phone, purpose });
    return jsonResponse({ ok: true, phone });
  } catch (err) {
    console.error("phone-otp-verify error", err);
    return new Response(JSON.stringify({ error: (err as Error).message || "Server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
