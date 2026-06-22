import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Loader2, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { useActiveSubscription } from "@/hooks/useActiveSubscription";
import { useNavigate } from "react-router-dom";

interface Props {
  onAdd: (email: string) => Promise<void>;
}

const AddTeacherDialog = ({ onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { isActive } = useActiveSubscription();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await onAdd(email.trim());
      toast.success("Request sent to teacher!");
      setEmail("");
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="gap-1"
        onClick={() => {
          toast.info("Subscribe to add a teacher and share your progress.");
          navigate("/subscribe");
        }}
      >
        <Lock className="w-4 h-4" />
        Add Teacher
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <UserPlus className="w-4 h-4" />
          Add Teacher
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Add a Teacher</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Teacher's email address
            </label>
            <Input
              type="email"
              placeholder="teacher@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
            <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your teacher will be able to see your quiz scores, progress, and which questions you got right or wrong. They cannot change your answers.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
            Send Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherDialog;
