import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const suppliedToken = authHeader.replace(/^Bearer\s+/i, "").trim();
    const { data: validInternalSecret } = suppliedToken
      ? await admin.rpc("is_valid_internal_secret", {
          _secret_name: "email_queue_service_role_key",
          _secret_value: suppliedToken,
        })
      : { data: false };

    if (authHeader !== `Bearer ${SERVICE_KEY}` && !validInternalSecret) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: pendingPayments, error } = await admin
      .from("payments")
      .select("id, dpo_transaction_token")
      .eq("payment_type", "yearly_subscription")
      .eq("status", "pending")
      .not("dpo_transaction_token", "is", null)
      .gte("created_at", new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString())
      .lte("created_at", new Date(Date.now() - 2 * 60 * 1000).toISOString())
      .order("created_at", { ascending: true })
      .limit(10);

    if (error) throw error;

    const results = [];
    for (const payment of pendingPayments ?? []) {
      const verifyRes = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/verify-yearly-dpo-payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          "x-dpo-server-callback": "1",
        },
        body: JSON.stringify({
          payment_id: payment.id,
          TransactionToken: payment.dpo_transaction_token,
        }),
      });
      const body = await verifyRes.text();
      results.push({ payment_id: payment.id, status: verifyRes.status, body });
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("reconcile-dpo-payments error", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});