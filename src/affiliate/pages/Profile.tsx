import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAffiliate } from "../hooks/useAffiliate";
import { useAffiliateAuth } from "../AffiliateAuthContext";

export const Profile = () => {
  const { affiliate, refetch } = useAffiliate();
  const { user } = useAffiliateAuth();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});
  const [pwd, setPwd] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (affiliate) {
      const pd: any = typeof affiliate.payout_details === "object" && affiliate.payout_details ? affiliate.payout_details : {};
      setForm({
        full_name: affiliate.full_name || "",
        phone: affiliate.phone || "",
        country: affiliate.country || "",
        payment_method: affiliate.payment_method || "",
        mobile_money_number: pd.mobile_money_number || "",
        payout_details: pd.notes || "",
      });
    }
  }, [affiliate]);

  if (!affiliate) return null;

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any).from("affiliates").update({
        full_name: form.full_name,
        phone: form.phone,
        country: form.country,
        payment_method: form.payment_method,
        payout_details: { notes: form.payout_details, mobile_money_number: form.mobile_money_number?.trim() || null },
      }).eq("id", affiliate.id);
      if (error) throw error;
      toast({ title: "Profile updated" });
      await refetch();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const changePwd = async () => {
    if (pwd.length < 8) return toast({ title: "Password too short", variant: "destructive" });
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Password updated" });
    setPwd("");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Profile</h1>

      <Card><CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Full name</Label><Input value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
          <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
          <div className="space-y-2"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} /></div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Payment method</Label>
            <Select value={form.payment_method} onValueChange={(v) => setForm({...form, payment_method: v})}>
              <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Mobile Money number (for payouts)</Label>
            <Input
              type="tel"
              inputMode="tel"
              placeholder="e.g. 0971234567"
              value={form.mobile_money_number}
              onChange={(e) => setForm({...form, mobile_money_number: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">
              Important: the mobile money account holder's name <strong>must match your full name</strong> above. Payouts to mismatched names will be rejected.
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Additional payout notes (optional)</Label>
            <Textarea value={form.payout_details} onChange={(e) => setForm({...form, payout_details: e.target.value})} placeholder="Bank account, PayPal email, or any other details" />
          </div>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
      </CardContent></Card>

      <Card><CardContent className="p-6 space-y-4">
        <h2 className="font-semibold">Change password</h2>
        <div className="space-y-2"><Label>New password</Label><Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} /></div>
        <Button onClick={changePwd} variant="outline">Update password</Button>
      </CardContent></Card>
    </div>
  );
};
