import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BASE_AMOUNT = 200;
const CURRENCY = "ZMW";
const PRODUCT_NAME = "RasGoal Yearly Subscription";

// Discount codes: code (uppercased) -> amount off in ZMW
// Discount codes: code (uppercased) -> { amount off in ZMW, expiresAt ISO date (inclusive, UTC end-of-day) }
const DISCOUNT_CODES: Record<string, { amount: number; expiresAt: string }> = {
  DARLIX01: { amount: 50, expiresAt: "2026-07-31" },
  EARLYBIRD: { amount: 50, expiresAt: "2026-06-30" },
};

function getDiscount(code: string): { amount: number; expired: boolean; known: boolean } {
  const entry = DISCOUNT_CODES[code];
  if (!entry) return { amount: 0, expired: false, known: false };
  const expiry = new Date(`${entry.expiresAt}T23:59:59.999Z`).getTime();
  if (Date.now() > expiry) return { amount: 0, expired: true, known: true };
  return { amount: entry.amount, expired: false, known: true };
}

function xmlEscape(s: string) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!)
  );
}

function extractTag(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].trim() : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const COMPANY_TOKEN = Deno.env.get("DPO_COMPANY_TOKEN")!;
    const SERVICE_TYPE = Deno.env.get("DPO_YEARLY_SERVICE_TYPE")!;
    const API_BASE = Deno.env.get("DPO_API_BASE_URL")!;
    const PAY_URL_BASE = Deno.env.get("DPO_PAYMENT_URL_BASE")!;
    const APP_BASE_URL = Deno.env.get("APP_BASE_URL")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    let body: any = {};
    try { body = await req.json(); } catch { /* no body */ }
    const rawCode = typeof body?.discount_code === "string" ? body.discount_code.trim() : "";
    const normalizedCode = rawCode.toUpperCase();
    const { amount: discount, expired, known } = rawCode ? getDiscount(normalizedCode) : { amount: 0, expired: false, known: true };
    if (rawCode && (!known || expired)) {
      return new Response(JSON.stringify({ error: expired ? "This discount code has expired" : "Invalid discount code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const AMOUNT = Math.max(0, BASE_AMOUNT - discount);

    const companyRef = `RASGOAL-YEARLY-${user.id.slice(0, 8)}-${Date.now()}`;

    const { data: payment, error: insErr } = await admin
      .from("payments")
      .insert({
        user_id: user.id,
        company_ref: companyRef,
        amount: AMOUNT,
        currency: CURRENCY,
        payment_type: "yearly_subscription",
        status: "pending",
      })
      .select()
      .single();
    if (insErr) throw insErr;

    const appBase = APP_BASE_URL.replace(/\/$/, "");
    const redirectURL = `${appBase}/payment/dpo/callback?payment_id=${payment.id}`;
    const backURL = `${appBase}/subscribe`;
    // Server-to-server callback so payments are still verified (and affiliate
    // commissions credited) even if the user closes the browser tab before
    // being redirected back from DPO.
    const callbackURL = `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/dpo-payment-callback?payment_id=${payment.id}`;

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dpoDate = `${now.getUTCFullYear()}/${pad(now.getUTCMonth() + 1)}/${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}`;

    const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${xmlEscape(COMPANY_TOKEN)}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${AMOUNT.toFixed(2)}</PaymentAmount>
    <PaymentCurrency>${xmlEscape(CURRENCY)}</PaymentCurrency>
    <CompanyRef>${xmlEscape(companyRef)}</CompanyRef>
    <RedirectURL>${xmlEscape(redirectURL)}</RedirectURL>
    <BackURL>${xmlEscape(backURL)}</BackURL>
    <CallbackURL>${xmlEscape(callbackURL)}</CallbackURL>
    <CompanyRefUnique>1</CompanyRefUnique>
    <PTL>5</PTL>
    <customerEmail>${xmlEscape(user.email ?? "")}</customerEmail>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>${xmlEscape(SERVICE_TYPE)}</ServiceType>
      <ServiceDescription>${xmlEscape(PRODUCT_NAME)}</ServiceDescription>
      <ServiceDate>${dpoDate}</ServiceDate>
    </Service>
  </Services>
</API3G>`;

    const dpoRes = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/xml; charset=utf-8", Accept: "application/xml" },
      body: xml,
    });
    const dpoText = await dpoRes.text();

    const code = extractTag(dpoText, "Result");
    const transToken = extractTag(dpoText, "TransToken");
    const explanation = extractTag(dpoText, "ResultExplanation");

    await admin
      .from("payments")
      .update({
        dpo_transaction_token: transToken,
        dpo_result_code: code,
        dpo_result_explanation: explanation,
        raw_create_token_response: dpoText,
        status: code === "000" ? "pending" : "failed",
      })
      .eq("id", payment.id);

    if (code !== "000" || !transToken) {
      return new Response(
        JSON.stringify({
          error: explanation ?? "Failed to create DPO transaction",
          code,
          fallback: true,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize: tolerate the secret containing a full path (e.g. ".../payv3.php?ID=token")
    // by extracting just the protocol+host root, then append the documented payv3.php path.
    let host = PAY_URL_BASE.trim();
    try {
      const u = new URL(host);
      host = `${u.protocol}//${u.host}`;
    } catch {
      host = host.replace(/\/(payv3\.php|pay\.asp).*$/i, "").replace(/\/$/, "");
    }
    const payment_url = `${host}/payv3.php?ID=${transToken}`;

    return new Response(
      JSON.stringify({ payment_id: payment.id, payment_url, transaction_token: transToken }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("create-yearly-dpo-payment error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
