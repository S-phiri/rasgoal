import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AffiliateAuthProvider, useAffiliateAuth } from "./AffiliateAuthContext";
import { AffiliateLayout } from "./AffiliateLayout";
import { AffiliateLogin } from "./pages/AffiliateLogin";
import { Dashboard } from "./pages/Dashboard";
import { Referrals } from "./pages/Referrals";
import { MyLink } from "./pages/MyLink";
import { Earnings } from "./pages/Earnings";
import { Profile } from "./pages/Profile";
import { Admin } from "./pages/Admin";
import ResetPassword from "@/pages/ResetPassword";
import { SetPassword } from "./pages/SetPassword";

const qc = new QueryClient();

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

const Protected = ({ children, adminOnly = false }: { children: any; adminOnly?: boolean }) => {
  const { user, loading, isAffiliate, isAdmin } = useAffiliateAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAffiliate) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-2">Access denied</h1>
        <p className="text-muted-foreground mb-4">This account is not registered as an affiliate.</p>
        <button className="text-primary hover:underline" onClick={async () => { const { supabase } = await import("@/integrations/supabase/client"); await supabase.auth.signOut(); location.href = "/login"; }}>Sign out</button>
      </div>
    </div>
  );
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <AffiliateLayout>{children}</AffiliateLayout>;
};

const LoginRoute = () => {
  const { user, loading, isAffiliate } = useAffiliateAuth();
  if (loading) return <Spinner />;
  if (user && isAffiliate) return <Navigate to="/" replace />;
  return <AffiliateLogin />;
};

const AffiliateApp = ({ basename }: { basename?: string }) => (
  <QueryClientProvider client={qc}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter basename={basename}>
        <AffiliateAuthProvider>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/" element={<Protected><Dashboard /></Protected>} />
            <Route path="/referrals" element={<Protected><Referrals /></Protected>} />
            <Route path="/link" element={<Protected><MyLink /></Protected>} />
            <Route path="/earnings" element={<Protected><Earnings /></Protected>} />
            <Route path="/profile" element={<Protected><Profile /></Protected>} />
            <Route path="/admin" element={<Protected adminOnly><Admin /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AffiliateAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AffiliateApp;
