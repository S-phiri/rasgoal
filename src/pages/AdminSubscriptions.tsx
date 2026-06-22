import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, ArrowLeft } from "lucide-react";

interface Row {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  mobile_number: string | null;
  plan_name: string | null;
  status: string;
  amount: number | null;
  currency: string | null;
  started_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString() : "—");

const downloadCSV = (rows: Row[]) => {
  if (!rows.length) return;
  const headers = ["full_name","email","mobile_number","plan_name","status","amount","currency","started_at","expires_at","created_at"];
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "subscriptions.csv"; a.click();
  URL.revokeObjectURL(url);
};

const AdminSubscriptions = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired">("all");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "affiliate_admin" as any)
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoading(true);
      const { data, error } = await (supabase as any).rpc("admin_list_subscriptions");
      if (!error) setRows((data || []) as Row[]);
      setLoading(false);
    })();
  }, [isAdmin]);

  const now = Date.now();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      const active = r.status === "active" && r.expires_at && new Date(r.expires_at).getTime() > now;
      if (statusFilter === "active" && !active) return false;
      if (statusFilter === "expired" && active) return false;
      if (!q) return true;
      return [r.full_name, r.email, r.mobile_number].some(v => v && v.toLowerCase().includes(q));
    });
  }, [rows, search, statusFilter, now]);

  const stats = useMemo(() => {
    const active = rows.filter(r => r.status === "active" && r.expires_at && new Date(r.expires_at).getTime() > now).length;
    const revenue = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
    return { total: rows.length, active, expired: rows.length - active, revenue };
  }, [rows, now]);

  if (authLoading || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="w-4 h-4" /> Back</Link></Button>
            <h1 className="text-3xl font-bold">Subscriptions</h1>
          </div>
          <Button variant="outline" onClick={() => downloadCSV(filtered)}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total },
            { label: "Active", value: stats.active },
            { label: "Expired", value: stats.expired },
            { label: "Revenue", value: `K${stats.revenue.toFixed(2)}` },
          ].map(s => (
            <Card key={s.label}><CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Search name, email, or mobile" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
          {(["all","active","expired"] as const).map(f => (
            <Button key={f} size="sm" variant={statusFilter === f ? "default" : "outline"} onClick={() => setStatusFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>

        <Card><CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Ends</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8">Loading…</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No subscriptions found</TableCell></TableRow>
              ) : filtered.map(r => {
                const active = r.status === "active" && r.expires_at && new Date(r.expires_at).getTime() > now;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.full_name || "—"}</TableCell>
                    <TableCell className="text-sm">{r.email || "—"}</TableCell>
                    <TableCell className="text-sm font-mono">{r.mobile_number || "—"}</TableCell>
                    <TableCell>{r.plan_name || "—"}</TableCell>
                    <TableCell>{r.amount != null ? `${r.currency || "K"}${Number(r.amount).toFixed(2)}` : "—"}</TableCell>
                    <TableCell>{fmt(r.started_at)}</TableCell>
                    <TableCell>{fmt(r.expires_at)}</TableCell>
                    <TableCell>
                      <Badge variant={active ? "default" : "secondary"} className="capitalize">{active ? "active" : "expired"}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
