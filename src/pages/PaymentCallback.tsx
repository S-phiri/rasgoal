import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle } from "lucide-react";

type Status = "loading" | "success" | "pending" | "failed" | "expired" | "cancelled" | "error";

const ICONS: Record<Status, JSX.Element> = {
  loading: <Loader2 className="w-12 h-12 text-primary animate-spin" />,
  success: <CheckCircle className="w-12 h-12 text-success" />,
  pending: <Clock className="w-12 h-12 text-primary" />,
  failed: <XCircle className="w-12 h-12 text-destructive" />,
  expired: <AlertCircle className="w-12 h-12 text-destructive" />,
  cancelled: <XCircle className="w-12 h-12 text-muted-foreground" />,
  error: <XCircle className="w-12 h-12 text-destructive" />,
};

const PaymentCallback = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Verifying your payment…");

  useEffect(() => {
    const paymentId = params.get("payment_id");
    const transactionToken = params.get("TransactionToken") ?? params.get("transToken") ?? undefined;

    if (!paymentId) {
      setStatus("error");
      setMessage("Missing payment reference.");
      return;
    }

    (async () => {
      const { data, error } = await supabase.functions.invoke("verify-yearly-dpo-payment", {
        body: { payment_id: paymentId, TransactionToken: transactionToken },
      });
      if (error) {
        setStatus("error");
        setMessage(error.message || "Could not verify payment.");
        return;
      }
      setStatus((data?.status as Status) ?? "error");
      setMessage(data?.message ?? "Unknown result");
    })();
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="bg-card rounded-2xl border border-border shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">{ICONS[status]}</div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          {status === "loading"
            ? "Verifying payment"
            : status === "success"
              ? "Payment successful"
              : status === "pending"
                ? "Payment pending"
                : status === "expired"
                  ? "Session expired"
                  : status === "cancelled"
                    ? "Payment cancelled"
                    : "Payment failed"}
        </h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex flex-col gap-2">
          {status === "success" ? (
            <Button onClick={() => navigate("/")} className="w-full">Go to dashboard</Button>
          ) : status === "loading" ? null : (
            <Button onClick={() => navigate("/subscribe")} className="w-full">Try again</Button>
          )}
          <Button variant="ghost" onClick={() => navigate("/")} className="w-full">Back to home</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
