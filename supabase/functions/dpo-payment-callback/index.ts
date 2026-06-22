import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function extractField(body: unknown, names: string[]): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  for (const name of names) {
    const value = record[name];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const url = new URL(req.url);
    const contentType = req.headers.get("content-type") ?? "";
    let payload: unknown = null;
    if (contentType.includes("application/json")) {
      payload = await req.json().catch(() => null);
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      payload = Object.fromEntries((await req.formData()).entries());
    } else {
      const text = await req.text().catch(() => "");
      payload = Object.fromEntries(new URLSearchParams(text).entries());
    }

    let paymentId = url.searchParams.get("payment_id") ?? extractField(payload, ["payment_id", "paymentId"]);
    const transactionToken =
      url.searchParams.get("TransactionToken") ??
      extractField(payload, ["TransactionToken", "TransToken", "transactionToken", "transToken"]);
    const companyRef = extractField(payload, ["CompanyRef", "company_ref", "merchantOrderId", "MerchantReference"]);

    if (!paymentId && (transactionToken || companyRef)) {
      const admin = createClient(SUPABASE_URL, SERVICE_KEY);
      let query = admin.from("payments").select("id").limit(1);
      query = transactionToken ? query.eq("dpo_transaction_token", transactionToken) : query.eq("company_ref", companyRef);
      const { data } = await query.maybeSingle();
      paymentId = data?.id ?? null;
    }

    if (!paymentId) {
      console.warn("DPO callback received without a resolvable payment reference");
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    const verifyRes = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/verify-yearly-dpo-payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        "x-dpo-server-callback": "1",
      },
      body: JSON.stringify({ payment_id: paymentId, TransactionToken: transactionToken ?? undefined }),
    });
    await verifyRes.text();

    if (!verifyRes.ok) console.warn("DPO callback verification returned non-success status", verifyRes.status);
    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("dpo-payment-callback error", error);
    return new Response("OK", { status: 200, headers: corsHeaders });
  }
});