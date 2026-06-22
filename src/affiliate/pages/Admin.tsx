import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Plus, Trash2, Shield, ShieldPlus, Eye, Phone, Mail, CreditCard, MapPin, User, Link2, Copy, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const downloadCSV = (rows: any[], filename: string) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

export const Admin = () => {
  const { toast } = useToast();
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newAff, setNewAff] = useState({ email: "", full_name: "" });
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [viewAffiliate, setViewAffiliate] = useState<any>(null);
  const [selectedCommissions, setSelectedCommissions] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const toggleCommission = (id: string) => {
    setSelectedCommissions(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleAllCommissions = (ids: string[], checked: boolean) => {
    setSelectedCommissions(checked ? new Set(ids) : new Set());
  };

  const bulkUpdateCommissions = async (status: "approved" | "paid") => {
    const ids = Array.from(selectedCommissions);
    if (!ids.length) return;
    setBulkBusy(true);
    try {
      const patch: any = { status };
      if (status === "approved") patch.approved_at = new Date().toISOString();
      if (status === "paid") {
        patch.paid_at = new Date().toISOString();
        patch.approved_at = new Date().toISOString();
      }
      const { error } = await (supabase as any).from("affiliate_commissions").update(patch).in("id", ids);
      if (error) throw error;
      toast({ title: `Marked ${ids.length} commission${ids.length === 1 ? "" : "s"} as ${status}` });
      setSelectedCommissions(new Set());
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setBulkBusy(false); }
  };

  const loadAdmins = async () => {
    const { data, error } = await supabase.functions.invoke("affiliate-admins", { body: { action: "list" } });
    if (error) return;
    setAdmins((data as any)?.admins || []);
  };

  const load = async () => {
    setLoading(true);
    const [a, c, r] = await Promise.all([
      (supabase as any).from("affiliates").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("affiliate_commissions").select("*").order("earned_at", { ascending: false }),
      (supabase as any).from("affiliate_referrals").select("affiliate_id,status"),
    ]);
    setAffiliates(a.data || []);
    setCommissions(c.data || []);
    setReferrals(r.data || []);
    setLoading(false);
    loadAdmins();
  };

  const refStats = (affId: string) => {
    const rows = referrals.filter(r => r.affiliate_id === affId);
    return { total: rows.length, subscribed: rows.filter(r => r.status === "subscribed").length };
  };
  useEffect(() => { load(); }, []);

  const addAdmin = async () => {
    const email = newAdminEmail.trim();
    if (!email) return;
    setAddingAdmin(true);
    try {
      const { data, error } = await supabase.functions.invoke("affiliate-admins", {
        body: { action: "add", email },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Admin added", description: (data as any)?.message || `${email} now has admin access.` });
      setNewAdminEmail("");
      setAdminDialogOpen(false);
      loadAdmins();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setAddingAdmin(false); }
  };

  const removeAdmin = async (adm: any) => {
    if (!confirm(`Remove admin access for ${adm.email}?`)) return;
    try {
      const { data, error } = await supabase.functions.invoke("affiliate-admins", {
        body: { action: "remove", user_id: adm.id },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Admin removed" });
      loadAdmins();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };


  const setStatus = async (id: string, status: string) => {
    await (supabase as any).from("affiliates").update({ status }).eq("id", id);
    toast({ title: `Affiliate ${status}` });
    load();
  };

  const deleteAffiliate = async (a: any) => {
    const label = a.full_name || a.email || a.code;
    if (!confirm(`Delete affiliate "${label}"? This cannot be undone. Their referral and commission history will remain for record-keeping.`)) return;
    const { error } = await (supabase as any).from("affiliates").delete().eq("id", a.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Affiliate deleted" });
    load();
  };

  const setCommissionStatus = async (id: string, status: string) => {
    const patch: any = { status };
    if (status === "approved") patch.approved_at = new Date().toISOString();
    if (status === "paid") patch.paid_at = new Date().toISOString();
    await (supabase as any).from("affiliate_commissions").update(patch).eq("id", id);
    load();
  };

  const createAffiliate = async () => {
    if (!newAff.email.trim()) return;
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("affiliate-invite", {
        body: { email: newAff.email.trim(), full_name: newAff.full_name.trim() },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Affiliate invited", description: (data as any)?.message || "Invite email sent" });
      setNewAff({ email: "", full_name: "" });
      load();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setCreating(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Admin</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadCSV(affiliates, "affiliates.csv")}>
            <Download className="w-4 h-4" /> Export affiliates
          </Button>
          <Button variant="outline" onClick={() => downloadCSV(commissions, "commissions.csv")}>
            <Download className="w-4 h-4" /> Export commissions
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4" /> New affiliate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Invite affiliate</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Enter the affiliate's email — they'll receive an email from Rasgoal with a link to set their password and access the affiliate portal.</p>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={newAff.email} onChange={(e) => setNewAff({...newAff, email: e.target.value})} placeholder="affiliate@example.com" /></div>
                <div className="space-y-2"><Label>Full name (optional)</Label><Input value={newAff.full_name} onChange={(e) => setNewAff({...newAff, full_name: e.target.value})} /></div>
                <p className="text-xs text-muted-foreground">Commission is fixed at <strong>K20</strong> per subscribed referral.</p>
                <Button onClick={createAffiliate} disabled={creating || !newAff.email}>{creating ? "Sending…" : "Send invite"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Affiliate</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Referrals</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={7} className="text-center py-8">Loading…</TableCell></TableRow> :
            affiliates.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No affiliates yet</TableCell></TableRow> :
            affiliates.map(a => {
              const s = refStats(a.id);
              return (
              <TableRow key={a.id}>
                <TableCell>{a.full_name || (a.user_id ? a.user_id.slice(0, 8) : "—")}</TableCell>
                <TableCell className="text-sm">{a.email || "—"}</TableCell>
                <TableCell className="font-mono">{a.code}</TableCell>
                <TableCell>
                  <span className="font-medium">{s.total}</span>
                  <span className="text-xs text-muted-foreground ml-1">({s.subscribed} subscribed)</span>
                </TableCell>
                <TableCell><Badge variant={a.status === "active" ? "default" : "secondary"} className="capitalize">{a.status}{!a.user_id ? " (pending signup)" : ""}</Badge></TableCell>
                <TableCell>{new Date(a.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setViewAffiliate(a)}><Eye className="w-4 h-4" /> Details</Button>
                  {a.status !== "active" && <Button size="sm" onClick={() => setStatus(a.id, "active")}>Approve</Button>}
                  {a.status === "active" && <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "inactive")}>Deactivate</Button>}
                  <Button size="sm" variant="destructive" onClick={() => deleteAffiliate(a)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent></Card>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold">Commissions</h2>
        {selectedCommissions.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedCommissions.size} selected</span>
            <Button size="sm" variant="outline" onClick={() => bulkUpdateCommissions("approved")} disabled={bulkBusy}>Approve selected</Button>
            <Button size="sm" onClick={() => bulkUpdateCommissions("paid")} disabled={bulkBusy}>Mark selected paid</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedCommissions(new Set())}>Clear</Button>
          </div>
        )}
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                {(() => {
                  const selectable = commissions.filter(c => c.status !== "paid").map(c => c.id);
                  const allChecked = selectable.length > 0 && selectable.every(id => selectedCommissions.has(id));
                  return (
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={(v) => toggleAllCommissions(selectable, !!v)}
                      disabled={selectable.length === 0}
                      aria-label="Select all"
                    />
                  );
                })()}
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Affiliate</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Sub amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No commissions yet</TableCell></TableRow> :
            commissions.map(c => {
              const aff = affiliates.find(a => a.id === c.affiliate_id);
              const pd: any = (aff?.payout_details && typeof aff.payout_details === "object") ? aff.payout_details : {};
              const momo = pd.mobile_money_number || aff?.phone || "—";
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCommissions.has(c.id)}
                      onCheckedChange={() => toggleCommission(c.id)}
                      disabled={c.status === "paid"}
                      aria-label="Select commission"
                    />
                  </TableCell>
                  <TableCell>{new Date(c.earned_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <button className="text-left hover:underline" onClick={() => aff && setViewAffiliate(aff)}>
                      <div className="font-medium">{aff?.full_name || aff?.code || "—"}</div>
                      <div className="text-xs text-muted-foreground">{aff?.email || ""}</div>
                    </button>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="capitalize">{aff?.payment_method?.replace("_", " ") || "—"}</div>
                    <div className="font-mono">{momo}</div>
                  </TableCell>
                  <TableCell>K{Number(c.subscription_amount).toFixed(2)}</TableCell>
                  <TableCell className="font-medium">K{Number(c.commission_amount).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={c.status === "paid" ? "default" : c.status === "approved" ? "secondary" : "outline"} className="capitalize">{c.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-2">
                    {c.status === "pending" && <Button size="sm" onClick={() => setCommissionStatus(c.id, "approved")}>Approve</Button>}
                    {c.status === "approved" && <Button size="sm" onClick={() => setCommissionStatus(c.id, "paid")}>Mark paid</Button>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!viewAffiliate} onOpenChange={(o) => !o && setViewAffiliate(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Affiliate details</DialogTitle></DialogHeader>
          {viewAffiliate && (() => {
            const pd: any = (viewAffiliate.payout_details && typeof viewAffiliate.payout_details === "object") ? viewAffiliate.payout_details : {};
            const rows: Array<[any, string, string]> = [
              [User, "Full name", viewAffiliate.full_name || "—"],
              [Mail, "Email", viewAffiliate.email || "—"],
              [Phone, "Phone", viewAffiliate.phone || "—"],
              [MapPin, "Country", viewAffiliate.country || "—"],
              [CreditCard, "Payment method", viewAffiliate.payment_method ? viewAffiliate.payment_method.replace("_", " ") : "—"],
              [Phone, "Mobile money number", pd.mobile_money_number || "—"],
            ];
            return (
              <div className="space-y-3">
                {rows.map(([Icon, label, val]) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="font-medium capitalize">{val}</div>
                    </div>
                  </div>
                ))}
                {pd.notes && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Additional payout notes</div>
                    <div className="text-sm whitespace-pre-wrap">{pd.notes}</div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground pt-2 border-t">
                  Important: the mobile money account holder's name must match the affiliate's full name above. Payouts to mismatched names should be rejected.
                </p>
                {(() => {
                  const link = `https://rasgoal.com/auth?ref=${viewAffiliate.code}`;
                  return (
                    <div className="pt-3 border-t space-y-3">
                      <div className="text-xs text-muted-foreground flex items-center gap-1"><Link2 className="w-3 h-3" /> Referral link & QR</div>
                      <div className="flex gap-2">
                        <Input readOnly value={link} className="font-mono text-xs" />
                        <Button size="sm" variant="outline" onClick={async () => { await navigator.clipboard.writeText(link); toast({ title: "Link copied" }); }}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded border">
                          <QRCodeSVG value={link} size={140} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div className="font-mono text-base text-foreground">{viewAffiliate.code}</div>
                          <div>Code shown above. Scan QR to open the signup link.</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>



      <div className="flex items-center justify-between flex-wrap gap-3 pt-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="w-5 h-5" /> Portal admins</h2>
        <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
          <DialogTrigger asChild>
            <Button><ShieldPlus className="w-4 h-4" /> Add admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add portal admin</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Grant another person full admin access to the affiliate portal. If they don't already have an account, an invite email will be sent so they can set a password.</p>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="admin@example.com" /></div>
              <Button onClick={addAdmin} disabled={addingAdmin || !newAdminEmail}>{addingAdmin ? "Adding…" : "Add admin"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No admins found</TableCell></TableRow> :
            admins.map(adm => (
              <TableRow key={adm.id}>
                <TableCell>{adm.email}</TableCell>
                <TableCell>{adm.created_at ? new Date(adm.created_at).toLocaleDateString() : "—"}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="destructive" onClick={() => removeAdmin(adm)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
};
