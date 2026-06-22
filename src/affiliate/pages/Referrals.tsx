import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAffiliate } from "../hooks/useAffiliate";

export const Referrals = () => {
  const { affiliate } = useAffiliate();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (!affiliate) return;
    (async () => {
      const { data: refs } = await (supabase as any)
        .from("affiliate_referrals")
        .select("*")
        .eq("affiliate_id", affiliate.id)
        .order("referred_at", { ascending: false });
      const ids = (refs || []).map((r: any) => r.referred_user_id);
      const [profiles, commissions] = await Promise.all([
        ids.length
          ? (supabase as any).from("profiles").select("user_id, full_name, username").in("user_id", ids)
          : Promise.resolve({ data: [] }),
        (supabase as any).from("affiliate_commissions").select("*").eq("affiliate_id", affiliate.id),
      ]);
      const pMap = new Map((profiles.data || []).map((p: any) => [p.user_id, p]));
      const cMap = new Map<string, any>();
      (commissions.data || []).forEach((c: any) => { if (c.referral_id) cMap.set(c.referral_id, c); });
      setRows((refs || []).map((r: any) => ({
        ...r,
        profile: pMap.get(r.referred_user_id),
        commission: cMap.get(r.id),
      })));
    })();
  }, [affiliate]);

  const statusBadge = (s: string) => {
    const variant = s === "subscribed" ? "default" : s === "trial" ? "secondary" : s === "cancelled" ? "destructive" : "outline";
    return <Badge variant={variant as any} className="capitalize">{s}</Badge>;
  };
  const payBadge = (s?: string) => s ? <Badge variant={s === "paid" ? "default" : s === "approved" ? "secondary" : "outline"} className="capitalize">{s}</Badge> : <span className="text-muted-foreground">—</span>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Referrals</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Referred</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No referrals yet — share your link to get started!</TableCell></TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.profile?.full_name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.profile?.username || "—"}</TableCell>
                  <TableCell>{new Date(r.referred_at).toLocaleDateString()}</TableCell>
                  <TableCell>{statusBadge(r.status)}</TableCell>
                  <TableCell>{r.commission ? `K${Number(r.commission.commission_amount).toFixed(2)}` : "—"}</TableCell>
                  <TableCell>{payBadge(r.commission?.status)}</TableCell>
                  <TableCell>{r.commission?.earned_at ? new Date(r.commission.earned_at).toLocaleDateString() : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
