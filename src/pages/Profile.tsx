import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AvatarUpload from "@/components/AvatarUpload";

const Profile = () => {
  const navigate = useNavigate();
  const { user, deleteAccount } = useAuth();
  const { profile, uploadAvatar, refetch } = useProfile();
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setSchool(profile.school || "");
      setGrade(profile.grade || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }
    if (trimmedName.length > 100) {
      toast.error("Name must be less than 100 characters");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: trimmedName,
          school: school.trim() || null,
          grade: grade.trim() || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      await refetch();
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim().toLowerCase() !== "delete my account") return;
    setDeletingAccount(true);
    try {
      await deleteAccount();
      toast.success("Account deleted. We're sorry to see you go.");
      navigate("/auth", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account");
    } finally {
      setDeletingAccount(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold font-display text-foreground">My Profile</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-20 h-20">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {fullName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <AvatarUpload avatarUrl={profile?.avatar_url || null} onUpload={uploadAvatar} />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled className="opacity-70" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Display Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Input
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Enter your school"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger id="grade">
                <SelectValue placeholder="Select your grade" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <SelectItem key={g} value={String(g)}>
                    Grade {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-border">
          <h2 className="text-sm font-semibold text-destructive mb-3">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. All your data — quizzes, progress, messages, and subscriptions — will be permanently removed.
          </p>
          <Button
            variant="outline"
            className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              setDeleteConfirmText("");
              setDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Delete Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. To confirm, type <strong>"delete my account"</strong> below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder='Type "delete my account"'
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText.trim().toLowerCase() !== "delete my account" || deletingAccount}
              onClick={handleDeleteAccount}
            >
              {deletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
