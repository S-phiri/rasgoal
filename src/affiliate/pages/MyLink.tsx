import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useAffiliate } from "../hooks/useAffiliate";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";

export const MyLink = () => {
  const { affiliate } = useAffiliate();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!affiliate) return null;
  const link = `https://rasgoal.com/auth?ref=${affiliate.code}`;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Copied!", description: "Referral link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">My Referral Link</h1>
        <p className="text-muted-foreground mt-1">
          Share this link with schools, teachers, or parents. When they subscribe, your commission will be tracked automatically.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your unique link</label>
            <div className="flex gap-2">
              <Input readOnly value={link} className="font-mono text-sm" />
              <Button onClick={copy} className="shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Your code</label>
            <div className="text-2xl font-bold font-mono tracking-wider">{affiliate.code}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex flex-col items-center gap-3">
          <h2 className="font-semibold">QR Code</h2>
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG value={link} size={200} />
          </div>
          <p className="text-sm text-muted-foreground text-center">Scan to open your referral signup link</p>
        </CardContent>
      </Card>
    </div>
  );
};
