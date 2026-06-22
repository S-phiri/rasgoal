import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleVerification = async () => {
      // Check if there's a session (email confirmed via link redirect)
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setStatus("error");
        setMessage(error.message || "Verification failed. The link may be expired or invalid.");
        return;
      }

      if (session) {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
        // Redirect after brief success display
        setTimeout(() => navigate("/", { replace: true }), 2500);
      } else {
        setStatus("error");
        setMessage("Verification link is expired or invalid. Please request a new one.");
      }
    };

    // Small delay to let auth state settle
    const timer = setTimeout(handleVerification, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="bg-card rounded-2xl border border-border shadow-lg p-8 max-w-md w-full text-center animate-slide-in">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>

        {status === "loading" && (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Verifying your email...</h1>
            <p className="text-muted-foreground text-sm">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Email Verified! 🎉</h1>
            <p className="text-muted-foreground text-sm mb-4">{message}</p>
            <p className="text-xs text-muted-foreground">Redirecting you to the app...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
            <p className="text-muted-foreground text-sm mb-6">{message}</p>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => navigate("/auth")}>
                Back to Sign In
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
