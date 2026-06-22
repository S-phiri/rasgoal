import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Loader2, Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "At least 1 uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "At least 1 number", test: (p: string) => /\d/.test(p) },
];

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for recovery session from the hash fragment
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");

    if (type === "recovery") {
      setValidSession(true);
    } else {
      // Also check if user already has an active session from the recovery link
      supabase.auth.getSession().then(({ data: { session } }) => {
        setValidSession(!!session);
      });
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordRules.every((r) => r.test(password))) {
      toast({ title: "Weak password", description: "Please meet all password requirements.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are identical.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      toast({ title: "Password updated! 🎉", description: "You can now sign in with your new password." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const allRulesPass = passwordRules.every((r) => r.test(password));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="bg-card rounded-2xl border border-border shadow-lg p-8 max-w-md w-full animate-slide-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Reset Password</h1>
        </div>

        {/* Invalid / expired link */}
        {validSession === false && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-foreground font-semibold">Invalid or expired link</p>
            <p className="text-muted-foreground text-sm">This password reset link is no longer valid. Please request a new one.</p>
            <Button className="w-full" onClick={() => navigate("/auth")}>Back to Sign In</Button>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <p className="text-foreground font-semibold">Password updated!</p>
            <p className="text-muted-foreground text-sm">Your password has been reset successfully.</p>
            <Button className="w-full" onClick={() => navigate("/")}>Go to Dashboard</Button>
          </div>
        )}

        {/* Reset form */}
        {validSession && !success && (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {passwordRules.map((rule) => {
                    const passes = rule.test(password);
                    return (
                      <li key={rule.label} className={`flex items-center gap-2 text-xs ${passes ? "text-success" : "text-muted-foreground"}`}>
                        {passes ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-xs text-destructive flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Passwords don't match</p>
              )}
            </div>

            <Button type="submit" className="w-full py-6 text-base font-semibold" disabled={loading || !allRulesPass || password !== confirmPassword}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reset Password
            </Button>
          </form>
        )}

        {/* Loading state */}
        {validSession === null && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
