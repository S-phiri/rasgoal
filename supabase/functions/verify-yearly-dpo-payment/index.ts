import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function xmlEscape(s: string) {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!)
  );
}
function extractTag(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].trim() : null;
}

const STATUS_BY_CODE: Record<string, { status: string; message: string; userStatus: string }> = {
  "000": { status: "paid", userStatus: "success", message: "Payment successful. Your yearly subscription is now active." },
  "001": { status: "pending", userStatus: "pending", message: "Payment authorized but not yet settled. Your subscription will activate once the payment is captured." },
  "002": { status: "pending", userStatus: "pending", message: "Payment amount mismatch (over/under paid). Please contact support." },
  "003": { status: "pending", userStatus: "pending", message: "Payment is pending at the bank. Please check back shortly." },
  "005": { status: "pending", userStatus: "pending", message: "Payment is queued for authorization. Please check back shortly." },
  "007": { status: "pending", userStatus: "pending", message: "Partial payment received. Please complete the remaining amount." },
  "900": { status: "pending", userStatus: "pending", message: "Your payment has not been completed yet. Please complete the payment or try again." },
  "901": { status: "failed", userStatus: "failed", message: "Payment was declined. Please try again." },
  "902": { status: "failed", userStatus: "failed", message: "Payment data mismatch. Please start a new payment." },
  "903": { status: "expired", userStatus: "expired", message: "This payment session has expired. Please start a new payment." },
  "904": { status: "cancelled", userStatus: "cancelled", message: "Payment was cancelled. Please start again if you still want to subscribe." },
  "950": { status: "failed", userStatus: "failed", message: "Payment verification failed due to missing data. Please contact support." },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const COMPANY_TOKEN = Deno.env.get("DPO_COMPANY_TOKEN")!;
    const API_BASE = Deno.env.get("DPO_API_BASE_URL")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const isServerCallback = req.headers.get("x-dpo-server-callback") === "1";
    if (isServerCallback && authHeader !== `Bearer ${SERVICE_KEY}`) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let userId: string | null = null;
    if (!isServerCallback) {
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
      userId = userData.user.id;
    }
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const { payment_id, TransactionToken } = body as { payment_id?: string; TransactionToken?: string };
    if (!payment_id) {
      return new Response(JSON.stringify({ error: "payment_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: payment, error: payErr } = await admin
      .from("payments")
      .select("*")
      .eq("id", payment_id)
      .single();
    if (payErr || !payment) {
      return new Response(JSON.stringify({ error: "Payment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (userId && payment.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Idempotency: if already paid, just return active subscription
    if (payment.status === "paid") {
      const { data: existingSub } = await admin
        .from("subscriptions")
        .select("*")
        .eq("payment_id", payment.id)
        .maybeSingle();
      return new Response(
        JSON.stringify({
          status: "success",
          message: "Payment successful. Your yearly subscription is now active.",
          payment_status: "paid",
          subscription: existingSub,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = payment.dpo_transaction_token;
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing transaction token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (TransactionToken && TransactionToken !== token) {
      return new Response(JSON.stringify({ error: "Transaction token mismatch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${xmlEscape(COMPANY_TOKEN)}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${xmlEscape(token)}</TransactionToken>
</API3G>`;

    const dpoRes = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/xml; charset=utf-8", Accept: "application/xml" },
      body: xml,
    });
    const dpoText = await dpoRes.text();
    const code = extractTag(dpoText, "Result") ?? "";
    const explanation = extractTag(dpoText, "ResultExplanation");

    const mapped = STATUS_BY_CODE[code] ?? {
      status: "failed",
      userStatus: "failed",
      message: explanation ?? "Payment verification failed.",
    };

    await admin
      .from("payments")
      .update({
        status: mapped.status,
        dpo_result_code: code,
        dpo_result_explanation: explanation,
        raw_verify_token_response: dpoText,
      })
      .eq("id", payment.id);

    let subscription = null;
    if (mapped.status === "paid") {
      // Idempotent activation: only create if no subscription is linked to this payment
      const { data: linkedSub } = await admin
        .from("subscriptions")
        .select("*")
        .eq("payment_id", payment.id)
        .maybeSingle();

      if (linkedSub) {
        subscription = linkedSub;
      } else {
        const now = new Date();
        const ownerId = payment.user_id;
        const { data: currentSub } = await admin
          .from("subscriptions")
          .select("*")
          .eq("user_id", ownerId)
          .eq("status", "active")
          .gt("expires_at", now.toISOString())
          .order("expires_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const baseDate = currentSub?.expires_at ? new Date(currentSub.expires_at) : now;
        const startFrom = baseDate > now ? baseDate : now;
        const startsAt = currentSub ? new Date(currentSub.started_at ?? now.toISOString()) : now;
        const endsAt = new Date(startFrom);
        endsAt.setUTCDate(endsAt.getUTCDate() + 365);

        if (currentSub) {
          const { data: updated } = await admin
            .from("subscriptions")
            .update({
              expires_at: endsAt.toISOString(),
              status: "active",
              plan_name: "Yearly Subscription",
              payment_id: payment.id,
            })
            .eq("id", currentSub.id)
            .select()
            .single();
          subscription = updated;
        } else {
          const { data: created } = await admin
            .from("subscriptions")
            .insert({
              user_id: ownerId,
              status: "active",
              plan_name: "Yearly Subscription",
              payment_id: payment.id,
              amount: payment.amount,
              currency: payment.currency,
              started_at: startsAt.toISOString(),
              expires_at: endsAt.toISOString(),
              payment_method: "dpo",
              transaction_ref: payment.company_ref,
            })
            .select()
            .single();
          subscription = created;
        }
      }

      // Notify referring affiliate (best-effort, non-blocking)
      try {
        const { data: commission } = await admin
          .from("affiliate_commissions")
          .select("affiliate_id, commission_amount, referral_id")
          .eq("payment_id", payment.id)
          .maybeSingle();

        if (commission?.affiliate_id) {
          const { data: aff } = await admin
            .from("affiliates")
            .select("id, user_id, email, full_name")
            .eq("id", commission.affiliate_id)
            .maybeSingle();

          let affEmail = aff?.email as string | null | undefined;
          if (!affEmail && aff?.user_id) {
            const { data: u } = await admin.auth.admin.getUserById(aff.user_id);
            affEmail = u?.user?.email ?? null;
          }

          // Totals
          const { data: allCommissions } = await admin
            .from("affiliate_commissions")
            .select("commission_amount, status")
            .eq("affiliate_id", commission.affiliate_id);
          const totalEarned = (allCommissions ?? []).reduce(
            (s: number, c: any) => s + Number(c.commission_amount || 0), 0,
          );
          const totalPending = (allCommissions ?? [])
            .filter((c: any) => c.status === "pending")
            .reduce((s: number, c: any) => s + Number(c.commission_amount || 0), 0);

          if (affEmail) {
            await admin.functions.invoke("send-transactional-email", {
              body: {
                templateName: "affiliate-referral-subscribed",
                recipientEmail: affEmail,
                idempotencyKey: `affiliate-commission-${payment.id}`,
                templateData: {
                  affiliateName: aff?.full_name ?? null,
                  commissionAmount: Number(commission.commission_amount || 20),
                  currency: "K",
                  totalPending,
                  totalEarned,
                  dashboardUrl: `${Deno.env.get("APP_BASE_URL") ?? "https://rasgoal.com"}/affiliate`,
                },
              },
            });
          }
        }
      } catch (notifyErr) {
        console.error("affiliate notification failed", notifyErr);
      }
    }

    return new Response(
      JSON.stringify({
        status: mapped.userStatus,
        message: mapped.message,
        payment_status: mapped.status,
        result_code: code,
        subscription,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("verify-yearly-dpo-payment error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
