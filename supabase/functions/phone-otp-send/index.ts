// Sends a 6-digit OTP via Zamtel Bulk SMS for phone signup or password reset.
// Rate-limited: max 1 resend per 60s, OTP valid 10 minutes.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ZM_PHONE_REGEX = /^\+260\d{9}$/;
const DE_PHONE_REGEX = /^\+49\d{10,11}$/;

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_RESENDS_PER_HOUR = 5;

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateOtp(): string {
  // Cryptographically secure 6-digit code
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0] % 1_000_000).toString().padStart(6, "0");
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

function cleanHeaderEnv(name: string, fallback = ""): string {
  const raw = Deno.env.get(name) ?? fallback;
  // HTTP header values must be ByteString-safe. Secret managers can preserve
  // invisible copy/paste characters, so keep only printable ASCII characters.
  return Array.from(raw.normalize("NFKC"))
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code >= 0x20 && code <= 0x7e;
    })
    .join("")
    .trim();
}

async function sendZamtelSms(phone: string, message: string) {
  const apiKey = cleanHeaderEnv("ZAMTEL_API_KEY");
  const senderRaw = cleanHeaderEnv("ZAMTEL_SENDER_ID", "rasgoal");
  const sender = senderRaw || "rasgoal";
  if (!apiKey) throw new Error("Zamtel API key not configured");

  // Zamtel BulkSMS v2.1.1 expects a URL-encoded HTTP URL, not a JSON POST body.
  const to = phone.startsWith("+") ? phone.slice(1) : phone;
  const endpoint = [
    "https://bulksms.zamtel.co.zm/api/v2.1/action/send/api_key",
    encodeURIComponent(apiKey),
    "contacts",
    encodeURIComponent(to),
    "senderId",
    encodeURIComponent(sender),
    "message",
    encodeURIComponent(message),
  ].join("/");

  const res = await fetch(endpoint, { method: "GET" });
  const text = await res.text();
  if (!res.ok) {
    console.error("Zamtel send failed", res.status, text);
    let providerMessage = text;
    try {
      const payload = JSON.parse(text);
      providerMessage = payload?.errors?.responseText || payload?.responseText || payload?.message || text;
    } catch {
      // Keep raw response text.
    }
    if (providerMessage.toLowerCase().includes("invalid api_key") || providerMessage.toLowerCase().includes("sender id")) {
      throw new Error("Zamtel rejected the stored API key or sender ID. Please update the Zamtel credentials and confirm the sender ID is approved exactly as entered.");
    }
    throw new Error(providerMessage || `SMS provider error (${res.status})`);
  }
  console.log("Zamtel send ok", res.status);
  return text;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { phone: rawPhone, purpose, fullName, username } = await req.json();

    if (!purpose || (purpose !== "signup" && purpose !== "reset")) {
      return new Response(JSON.stringify({ error: "Invalid purpose" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const phone = normalizePhone(rawPhone || "");
    if (!phone) {
      return new Response(JSON.stringify({ error: "Invalid phone number. Use a Zambian (+260) or German (+49) mobile number." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Lookup user with this phone. Phone auth's built-in SMS provider is intentionally bypassed;
    // users created by this flow use a private email identity derived from the verified phone.
    const loginEmail = phoneLoginEmail(phone);
    const { data: list, error: lookupErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (lookupErr) throw lookupErr;
    const existing = list.users.find((u) =>
      u.email?.toLowerCase() === loginEmail ||
      u.user_metadata?.mobile_number === phone ||
      samePhone(u.phone, phone)
    );

    if (purpose === "signup") {
      const migratedPhoneAccount = existing?.email?.toLowerCase() === loginEmail || existing?.user_metadata?.mobile_number === phone;
      if (migratedPhoneAccount) {
        return new Response(JSON.stringify({ error: "An account with this phone already exists. Please sign in." }), {
          status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (username) {
        const { data: takenUser } = await supabase.from("profiles").select("id").ilike("username", username).maybeSingle();
        if (takenUser) {
          return new Response(JSON.stringify({ error: "Username is already taken." }), {
            status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    } else if (purpose === "reset") {
      if (!existing) {
        // Don't disclose existence; just succeed silently
        return new Response(JSON.stringify({ ok: true }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Rate-limit: check most recent OTP for this phone+purpose
    const { data: recent } = await supabase
      .from("phone_otps")
      .select("*")
      .eq("phone", phone)
      .eq("purpose", purpose)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = Date.now();
    if (recent) {
      const lastSent = new Date(recent.last_sent_at).getTime();
      if (now - lastSent < RESEND_COOLDOWN_MS) {
        const wait = Math.ceil((RESEND_COOLDOWN_MS - (now - lastSent)) / 1000);
        return new Response(JSON.stringify({ error: `Please wait ${wait}s before requesting a new code.` }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (recent.resend_count >= MAX_RESENDS_PER_HOUR) {
        const created = new Date(recent.created_at).getTime();
        if (now - created < 60 * 60 * 1000) {
          return new Response(JSON.stringify({ error: "Too many code requests. Please try again later." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    const otp = generateOtp();
    const codeHash = await sha256Hex(otp);
    const expiresAt = new Date(now + OTP_TTL_MS).toISOString();

    // Invalidate any active OTPs for this phone+purpose, then insert fresh row
    await supabase
      .from("phone_otps")
      .update({ consumed_at: new Date().toISOString() })
      .eq("phone", phone)
      .eq("purpose", purpose)
      .is("consumed_at", null);

    const { data: insertedOtp, error: insErr } = await supabase.from("phone_otps").insert({
      phone,
      purpose,
      code_hash: codeHash,
      expires_at: expiresAt,
      attempts: 0,
      resend_count: recent ? (recent.resend_count + 1) : 0,
      last_sent_at: new Date().toISOString(),
    }).select("id").single();
    if (insErr) throw insErr;

    const message = `Your Rasgoal verification code is ${otp}. It expires in 10 minutes. Do not share this code.`;
    try {
      await sendZamtelSms(phone, message);
    } catch (smsErr) {
      console.error("SMS send failed for", phone, smsErr);
      await supabase.from("phone_otps").update({ consumed_at: new Date().toISOString() }).eq("id", insertedOtp.id);
      return new Response(JSON.stringify({ error: (smsErr as Error).message || "Failed to send SMS. Please try again shortly." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, phone }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("phone-otp-send error", err);
    return new Response(JSON.stringify({ error: (err as Error).message || "Server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
