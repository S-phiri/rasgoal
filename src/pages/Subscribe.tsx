import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowLeft, CheckCircle, Loader2, Sparkles, Tag } from "lucide-react";
import { useActiveSubscription } from "@/hooks/useActiveSubscription";

const BASE_PRICE = 200;
// Discount codes with expiry (ISO date — code valid through end of this day UTC)
const DISCOUNTS: Record<string, { amount: number; expiresAt: string }> = {
  DARLIX01: { amount: 50, expiresAt: "2026-07-31" },
  EARLYBIRD: { amount: 50, expiresAt: "2026-06-30" },
};

function getDiscountForCode(code: string): { amount: number; expired: boolean } {
  const entry = DISCOUNTS[code];
  if (!entry) return { amount: 0, expired: false };
  // Expires at end of the given day UTC (inclusive)
  const expiry = new Date(`${entry.expiresAt}T23:59:59.999Z`).getTime();
  if (Date.now() > expiry) return { amount: 0, expired: true };
  return { amount: entry.amount, expired: false };
}

const Subscribe = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { subscription, isActive, loading: subLoading } = useActiveSubscription();
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const normalized = discountCode.trim().toUpperCase();
  const { amount: discount, expired: codeExpired } = getDiscountForCode(normalized);
  const codeInvalid = discountCode.trim().length > 0 && discount === 0;
  const finalPrice = Math.max(0, BASE_PRICE - discount);

  const handlePay = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-yearly-dpo-payment", {
        body: { discount_code: discountCode.trim() || undefined },
      });
      if (error) throw error;
      if (data?.error) {
        throw new Error(
          data.code === "802"
            ? "Payments are temporarily unavailable. Please try again later or contact support."
            : data.error
        );
      }
      if (!data?.payment_url) throw new Error("No payment URL returned");
      window.open(data.payment_url as string, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      toast({ title: "Could not start payment", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="bg-card rounded-2xl border border-border shadow-lg p-8 max-w-md w-full animate-slide-in">
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium mb-6 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Yearly Subscription</h1>
          <p className="text-muted-foreground mt-2">Unlock all tests for a full year</p>
        </div>

        {isActive && subscription?.expires_at && (
          <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm font-semibold text-foreground">
              Yearly subscription active until{" "}
              {new Date(subscription.expires_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}


        <div className="border-2 border-primary rounded-xl p-6 mb-6 relative">
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Best value
          </span>
          <p className="text-sm text-muted-foreground">RasGoal Yearly Subscription</p>
          <div className="font-display text-4xl font-bold text-foreground mt-1">
            {discount > 0 && (
              <span className="text-2xl text-muted-foreground font-normal line-through mr-2">
                K{BASE_PRICE}
              </span>
            )}
            K{finalPrice}
            <span className="text-base text-muted-foreground font-normal">/year</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">365 days of full access</p>
          {discount > 0 && (
            <p className="text-xs text-success font-semibold mt-1">
              Discount applied: −K{discount}
            </p>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {[
            "Access to all tests",
            "Unlimited quiz attempts",
            "Track your quiz history",
            "Detailed learning tips",
            "Add a teacher or tutor",
            "Access to online classes from added teacher",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
              <CheckCircle className="w-4 h-4 text-success shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Discount code (optional)
          </label>
          <Input
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Enter code"
            className={codeInvalid ? "border-destructive" : ""}
          />
          {codeInvalid && (
            <p className="text-xs text-destructive mt-1">
              {codeExpired ? "This discount code has expired" : "Invalid discount code"}
            </p>
          )}
        </div>

        <Button
          onClick={handlePay}
          className="w-full py-6 text-base font-semibold"
          disabled={loading || subLoading || codeInvalid}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Preparing secure payment…
            </>
          ) : isActive ? (
            `Extend yearly subscription — K${finalPrice}`
          ) : (
            `Pay K${finalPrice} for Yearly Subscription`
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
          One-time payment. Does not auto-renew. After 365 days you'll need to manually start a new
          subscription.
        </p>

        <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
          Secured by DPO Pay. By subscribing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-foreground transition-colors">
            Terms
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Subscribe;
