import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAffiliate } from "../hooks/useAffiliate";
import { Users, CheckCircle, Clock, DollarSign, Banknote, Calendar, Wallet, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Stat = ({ icon: Icon, label, value, hint }: any) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const { affiliate, loading } = useAffiliate();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!affiliate) return;
    let cancelled = false;
    const load = async () => {
      const [refs, comms] = await Promise.all([
        (supabase as any).from("affiliate_referrals").select("status, referred_at").eq("affiliate_id", affiliate.id),
        (supabase as any).from("affiliate_commissions").select("status, commission_amount, earned_at").eq("affiliate_id", affiliate.id),
      ]);
      if (cancelled) return;
      const r = refs.data || [];
      const c = comms.data || [];
      const totalEarned = c.reduce((s: number, x: any) => s + Number(x.commission_amount || 0), 0);
      const paid = c.filter((x: any) => x.status === "paid").reduce((s: number, x: any) => s + Number(x.commission_amount), 0);
      const lastRef = r.length ? new Date(Math.max(...r.map((x: any) => new Date(x.referred_at).getTime()))) : null;
      const lastSub = c.length ? new Date(Math.max(...c.map((x: any) => new Date(x.earned_at).getTime()))) : null;
      setStats({
        total: r.length,
        subscribed: r.filter((x: any) => x.status === "subscribed").length,
        pending: r.filter((x: any) => x.status === "pending").length,
        totalEarned,
        paid,
        unpaid: totalEarned - paid,
        lastRef,
        lastSub,
      });
    };
    load();

    // Auto-refresh: realtime, window focus, and a periodic safety net.
    const channel = (supabase as any)
      .channel(`affiliate-dash-${affiliate.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "affiliate_referrals", filter: `affiliate_id=eq.${affiliate.id}` }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "affiliate_commissions", filter: `affiliate_id=eq.${affiliate.id}` }, load)
      .subscribe();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    const interval = window.setInterval(load, 30000);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      window.clearInterval(interval);
      (supabase as any).removeChannel(channel);
    };
  }, [affiliate]);

  if (loading) return <div>Loading…</div>;
  if (!affiliate) return (
    <Card><CardContent className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">Account not yet provisioned</h2>
      <p className="text-muted-foreground">Your affiliate account hasn't been set up. Please contact the Rasgoal team.</p>
    </CardContent></Card>
  );

  const statusColor = affiliate.status === "active" ? "default" : affiliate.status === "pending" ? "secondary" : "destructive";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {affiliate.full_name || "affiliate"}</p>
        </div>
        <Badge variant={statusColor as any} className="capitalize">{affiliate.status}</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={Users} label="Total referrals" value={stats?.total ?? "—"} />
        <Stat icon={CheckCircle} label="Subscribed" value={stats?.subscribed ?? "—"} />
        <Stat icon={Clock} label="Pending referrals" value={stats?.pending ?? "—"} />
        <Stat icon={DollarSign} label="Total earnings" value={`K${(stats?.totalEarned ?? 0).toFixed(2)}`} />
        <Stat icon={Wallet} label="Paid out" value={`K${(stats?.paid ?? 0).toFixed(2)}`} />
        <Stat icon={TrendingUp} label="Unpaid balance" value={`K${(stats?.unpaid ?? 0).toFixed(2)}`} />
        <Stat icon={Banknote} label="Commission per referral" value={`K20.00`} />
        <Stat
          icon={Calendar}
          label="Last activity"
          value={stats?.lastSub ? stats.lastSub.toLocaleDateString() : (stats?.lastRef ? stats.lastRef.toLocaleDateString() : "—")}
          hint={stats?.lastRef ? `Last referral: ${stats.lastRef.toLocaleDateString()}` : undefined}
        />
      </div>
    </div>
  );
};
