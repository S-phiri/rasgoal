import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type State = "validating" | "ready" | "submitting" | "done" | "already" | "invalid";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<State>("validating");

  useEffect(() => {
    (async () => {
      if (!token) { setState("invalid"); return; }
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_KEY } }
        );
        const data = await res.json();
        if (!res.ok) { setState("invalid"); return; }
        if (data.valid === false && data.reason === "already_unsubscribed") setState("already");
        else if (data.valid) setState("ready");
        else setState("invalid");
      } catch {
        setState("invalid");
      }
    })();
  }, [token]);

  const handleConfirm = async () => {
    setState("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
    if (error) { setState("invalid"); return; }
    if (data?.success) setState("done");
    else if (data?.reason === "already_unsubscribed") setState("already");
    else setState("invalid");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Email preferences</h1>

        {state === "validating" && (
          <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        )}

        {state === "ready" && (
          <>
            <p className="text-muted-foreground">
              Click below to unsubscribe from Rasgoal emails. You can still log in to your account.
            </p>
            <Button onClick={handleConfirm} className="w-full">Confirm unsubscribe</Button>
          </>
        )}

        {state === "submitting" && (
          <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        )}

        {state === "done" && (
          <div className="space-y-2">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
            <p className="text-foreground">You've been unsubscribed.</p>
          </div>
        )}

        {state === "already" && (
          <div className="space-y-2">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
            <p className="text-foreground">You're already unsubscribed.</p>
          </div>
        )}

        {state === "invalid" && (
          <div className="space-y-2">
            <XCircle className="w-10 h-10 text-destructive mx-auto" />
            <p className="text-foreground">This unsubscribe link is invalid or has expired.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
