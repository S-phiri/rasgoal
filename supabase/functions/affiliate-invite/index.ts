import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SENDER_DOMAIN = "notify.rasgoal.com";
const FROM = `Rasgoal Affiliates <noreply@${SENDER_DOMAIN}>`;

function buildEmailHtml(opts: {
  fullName: string;
  isExisting: boolean;
  affiliatePortalUrl: string;
  setPasswordUrl: string | null;
  mainSiteUrl: string;
  refLink: string;
  code: string;
}) {
  const { fullName, isExisting, affiliatePortalUrl, setPasswordUrl, mainSiteUrl, refLink, code } = opts;
  const greeting = fullName ? `Hi ${fullName},` : "Hello,";

  const ctaBlock = isExisting
    ? `
      <p style="margin:0 0 16px;">You already have a Rasgoal student account, so you can use your <strong>existing email and password</strong> to sign in to the Affiliate Portal.</p>
      <p style="margin:24px 0;text-align:center;">
        <a href="${affiliatePortalUrl}" style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Sign in to Affiliate Portal →</a>
      </p>`
    : `
      <p style="margin:0 0 16px;">To get started, set your password for the <strong>Affiliate Portal</strong> (this is a separate login from the Rasgoal student site):</p>
      <p style="margin:24px 0;text-align:center;">
        <a href="${setPasswordUrl}" style="background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Set your password →</a>
      </p>
      <p style="margin:0 0 16px;font-size:13px;color:#666;">Or copy this link into your browser:<br/><span style="word-break:break-all;color:#16a34a;">${setPasswordUrl}</span></p>`;

  return `<!doctype html>
<html><body style="background:#fff;margin:0;padding:0;font-family:Arial,sans-serif;color:#222;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">
  <h1 style="font-size:22px;margin:0 0 16px;">Welcome to the Rasgoal Affiliate Program 🎉</h1>
  <p style="margin:0 0 16px;">${greeting}</p>
  <p style="margin:0 0 16px;">You have been invited as an affiliate for <strong>Rasgoal</strong>. You'll earn <strong>K20</strong> for every referred user who subscribes.</p>

  <h2 style="font-size:16px;margin:24px 0 8px;color:#16a34a;">1) Your Affiliate Portal (separate login)</h2>
  ${ctaBlock}

  <h2 style="font-size:16px;margin:24px 0 8px;color:#16a34a;">2) Your unique referral link</h2>
  <p style="margin:0 0 8px;">Share this link to refer students to the main Rasgoal site:</p>
  <p style="margin:0 0 16px;padding:12px;background:#f4f4f5;border-radius:6px;word-break:break-all;font-family:monospace;font-size:13px;">${refLink}</p>
  <p style="margin:0 0 16px;font-size:13px;color:#666;">Your referral code: <strong>${code}</strong></p>

  <h2 style="font-size:16px;margin:24px 0 8px;">Two different sites — don't confuse them:</h2>
  <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;">
    <li><strong>Affiliate Portal</strong> (where you log in to track earnings): <a href="${affiliatePortalUrl}" style="color:#16a34a;">${affiliatePortalUrl}</a></li>
    <li><strong>Rasgoal student platform</strong> (what you share with referrals): <a href="${mainSiteUrl}" style="color:#16a34a;">${mainSiteUrl}</a></li>
  </ul>

  <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
  <p style="font-size:12px;color:#888;margin:0;">If you weren't expecting this email, you can safely ignore it.</p>
</div>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isAdmin } = await admin.rpc("is_affiliate_admin", { _user_id: userData.user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const fullName = String(body.full_name || "").trim();
    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Valid email required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const origin = req.headers.get("origin") || "https://rasgoal.com";
    // Detect if origin is the affiliate subdomain or main site - normalize URLs
    const url = new URL(origin);
    const baseHost = url.hostname.replace(/^affiliates?\./i, "");
    const mainSiteUrl = `${url.protocol}//${baseHost}`;
    const affiliatePortalUrl = `${mainSiteUrl}/affiliate`;
    const setPasswordRedirect = `${mainSiteUrl}/affiliate/set-password`;

    // Check if user already exists in auth (paginate — listUsers default is 50/page)
    let existingUser: { id: string; email?: string } | undefined;
    for (let page = 1; page <= 50; page++) {
      const { data: existing, error: listErr } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (listErr) throw listErr;
      const users = existing?.users ?? [];
      const match = users.find((u: any) => (u.email || "").toLowerCase() === email);
      if (match) { existingUser = match as any; break; }
      if (users.length < 200) break;
    }
    const userId: string | null = existingUser?.id || null;

    // Find or create affiliate row
    const { data: existingAff } = await admin.from("affiliates").select("id,code").ilike("email", email).maybeSingle();
    let code = existingAff?.code as string | undefined;
    if (!existingAff) {
      code = Math.random().toString(36).slice(2, 8).toUpperCase();
      const { error: insErr } = await admin.from("affiliates").insert({
        email,
        full_name: fullName || null,
        code,
        commission_rate: 20,
        status: "active",
        user_id: userId,
      });
      if (insErr) throw insErr;
    } else {
      // Re-activate any previously deactivated/suspended affiliate row and
      // attach the user_id if we now know it. This is what makes "add again"
      // work for affiliates that were deactivated earlier.
      const patch: Record<string, unknown> = { status: "active" };
      if (userId) patch.user_id = userId;
      if (fullName) patch.full_name = fullName;
      await admin.from("affiliates").update(patch).eq("id", existingAff.id);
    }

    const refLink = `${mainSiteUrl}/auth?ref=${code}`;

    // Generate set-password link only for new users (existing users use their current password)
    let setPasswordUrl: string | null = null;
    let treatAsExisting = !!existingUser;
    if (!existingUser) {
      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: "invite",
        email,
        options: { redirectTo: setPasswordRedirect, data: { full_name: fullName } },
      });
      if (linkErr) {
        const msg = (linkErr.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
          // User exists but wasn't returned by listUsers (pagination/edge case).
          // Fall back to the "existing user" email flow.
          treatAsExisting = true;
        } else {
          throw linkErr;
        }
      } else {
        setPasswordUrl = (linkData as any)?.properties?.action_link || setPasswordRedirect;
      }
    }

    const html = buildEmailHtml({
      fullName,
      isExisting: treatAsExisting,
      affiliatePortalUrl,
      setPasswordUrl,
      mainSiteUrl,
      refLink,
      code: code!,
    });

    const greeting = fullName ? `Hi ${fullName},` : "Hello,";
    const text = treatAsExisting
      ? `${greeting}\n\nYou've been added as an affiliate for Rasgoal. You'll earn K20 for every referred user who subscribes.\n\nYou already have a Rasgoal student account, so use your existing email and password to sign in to the Affiliate Portal:\n${affiliatePortalUrl}\n\nYour unique referral link:\n${refLink}\n\nReferral code: ${code}\n\nTwo different sites:\n- Affiliate Portal (where you log in to track earnings): ${affiliatePortalUrl}\n- Rasgoal student platform (what you share with referrals): ${mainSiteUrl}\n`
      : `${greeting}\n\nYou've been invited as an affiliate for Rasgoal. You'll earn K20 for every referred user who subscribes.\n\nSet your password for the Affiliate Portal:\n${setPasswordUrl}\n\nYour unique referral link:\n${refLink}\n\nReferral code: ${code}\n\nTwo different sites:\n- Affiliate Portal (where you log in to track earnings): ${affiliatePortalUrl}\n- Rasgoal student platform (what you share with referrals): ${mainSiteUrl}\n`;

    const subject = treatAsExisting
      ? "You're now a Rasgoal affiliate — sign in to your portal"
      : "Welcome to the Rasgoal Affiliate Program — set your password";

    // Get or create an unsubscribe token for this recipient (one per email address)
    let unsubscribeToken: string;
    const { data: existingTok } = await admin
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", email)
      .maybeSingle();
    if (existingTok?.token) {
      unsubscribeToken = existingTok.token;
    } else {
      unsubscribeToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
      const { error: tokErr } = await admin
        .from("email_unsubscribe_tokens")
        .insert({ email, token: unsubscribeToken });
      if (tokErr) throw tokErr;
    }

    // Enqueue branded email via the shared queue
    const messageId = `aff-invite-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const { error: enqErr } = await admin.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: email,
        from: FROM,
        sender_domain: SENDER_DOMAIN,
        subject,
        html,
        text,
        purpose: "transactional",
        label: "affiliate_invite",
        idempotency_key: messageId,
        message_id: messageId,
        unsubscribe_token: unsubscribeToken,
        queued_at: new Date().toISOString(),
      },
    });
    if (enqErr) throw enqErr;

    return new Response(
      JSON.stringify({
        ok: true,
        message: treatAsExisting
          ? "Affiliate added. Notification email queued — they can sign in with their existing Rasgoal password."
          : "Invite email queued.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
