import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Crown, GraduationCap, BookOpen, Menu, Loader2, UserCircle, MessageCircle, Video, Mail, Copy } from "lucide-react";
import { toast } from "sonner";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { role, roles, loading, switchRole } = useUserRole();
  const { count: unreadCount } = useUnreadMessages();
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);
  const CONTACT_EMAIL = "info@rasgoal.com";

  if (!user) return null;

  const otherRole = role === "teacher" ? "student" : "teacher";
  const canSwitchRoles = roles.length >= 2 && !!role;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleSwitch = () => {
    if (!canSwitchRoles) return;
    switchRole(otherRole);
    toast.success(`Switched to ${otherRole} view`);
    navigate(otherRole === "teacher" ? "/teacher" : "/", { replace: true });
  };

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 relative">
          <Menu className="w-4 h-4" />
          <span className="hidden sm:inline">Menu</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="space-y-1">
          <p className="text-xs font-medium text-foreground truncate">{user.email}</p>
          <p className="text-[11px] font-normal text-muted-foreground">
            {loading ? "Loading role..." : `Current role: ${role ?? "Not set"}`}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <DropdownMenuItem disabled className="gap-2 opacity-70">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading roles...
          </DropdownMenuItem>
        ) : canSwitchRoles ? (
          <DropdownMenuItem onClick={handleSwitch} className="gap-2 cursor-pointer">
            {otherRole === "teacher" ? (
              <GraduationCap className="w-4 h-4 text-accent" />
            ) : (
              <BookOpen className="w-4 h-4 text-primary" />
            )}
            Switch to {otherRole}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled className="gap-2 opacity-70">
            {role === "teacher" ? (
              <GraduationCap className="w-4 h-4 text-accent" />
            ) : (
              <BookOpen className="w-4 h-4 text-primary" />
            )}
            Only one role available
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2 cursor-pointer">
          <UserCircle className="w-4 h-4 text-primary" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate(role === "teacher" ? "/teacher/classes" : "/classes")}
          className="gap-2 cursor-pointer"
        >
          <Video className="w-4 h-4 text-primary" />
          Live Classes
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate(role === "teacher" ? "/teacher/messages" : "/messages")}
          className="gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="flex-1">Messages</span>
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate("/subscribe")} className="gap-2 cursor-pointer">
          <Crown className="w-4 h-4 text-secondary" />
          Subscribe
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setContactOpen(true)} className="gap-2 cursor-pointer">
          <Mail className="w-4 h-4 text-primary" />
          Contact Us
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={contactOpen} onOpenChange={setContactOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" /> Contact Us
          </DialogTitle>
          <DialogDescription>
            Email us anytime — we usually reply within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-foreground break-all hover:text-primary transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 gap-1.5"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(CONTACT_EMAIL);
                toast.success("Email copied to clipboard");
              } catch {
                toast.error("Couldn't copy — please copy manually");
              }
            }}
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default UserMenu;
