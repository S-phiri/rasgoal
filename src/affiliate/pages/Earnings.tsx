import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAffiliate } from "../hooks/useAffiliate";

const Stat = ({ label, value }: any) => (
  <Card><CardContent className="p-5">
    <div className="text-sm text-muted-foreground mb-1">{label}</div>
    <div className="text-2xl font-bold">K{value.toFixed(2)}</div>
  </CardContent></Card>
);

export const Earnings = () => {
  const { affiliate } = useAffiliate();
  const [comms, setComms] = useState<any[]>([]);

  useEffect(() => {
    if (!affiliate) return;
    let cancelled = false;
    const load = async () => {
      const { data } = await (supabase as any)
        .from("affiliate_commissions")
        .select("*")
        .eq("affiliate_id", affiliate.id)
        .order("earned_at", { ascending: false });
      if (!cancelled) setComms(data || []);
    };
    load();
    const channel = (supabase as any)
      .channel(`affiliate-earnings-${affiliate.id}`)
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

  const total = comms.reduce((s, c) => s + Number(c.commission_amount), 0);
  const pending = comms.filter(c => c.status === "pending").reduce((s, c) => s + Number(c.commission_amount), 0);
  const approved = comms.filter(c => c.status === "approved").reduce((s, c) => s + Number(c.commission_amount), 0);
  const paid = comms.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.commission_amount), 0);

  const monthly: Record<string, number> = {};
  comms.forEach(c => {
    const m = new Date(c.earned_at).toLocaleString("default", { month: "short", year: "numeric" });
    monthly[m] = (monthly[m] || 0) + Number(c.commission_amount);
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Earnings</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total earned" value={total} />
        <Stat label="Pending" value={pending} />
        <Stat label="Approved" value={approved} />
        <Stat label="Paid" value={paid} />
      </div>

      {Object.keys(monthly).length > 0 && (
        <Card><CardContent className="p-6">
          <h2 className="font-semibold mb-4">By month</h2>
          <div className="space-y-2">
            {Object.entries(monthly).map(([m, v]) => (
              <div key={m} className="flex justify-between text-sm border-b border-border py-2 last:border-0">
                <span>{m}</span>
                <span className="font-medium">K{v.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent></Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subscription amount</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comms.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No commissions yet</TableCell></TableRow>
              )}
              {comms.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{new Date(c.earned_at).toLocaleDateString()}</TableCell>
                  <TableCell>K{Number(c.subscription_amount).toFixed(2)}</TableCell>
                  <TableCell>{c.commission_rate}%</TableCell>
                  <TableCell className="font-medium">K{Number(c.commission_amount).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={c.status === "paid" ? "default" : c.status === "approved" ? "secondary" : "outline"} className="capitalize">{c.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
