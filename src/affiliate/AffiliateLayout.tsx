import { ReactNode, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, Users, Link2, Wallet, User, Shield, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAffiliateAuth } from "./AffiliateAuthContext";
import { cn } from "@/lib/utils";

export const AffiliateLayout = ({ children }: { children: ReactNode }) => {
  const { isAdmin, signOut } = useAffiliateAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/referrals", icon: Users, label: "My Referrals" },
    { to: "/link", icon: Link2, label: "My Link" },
    { to: "/earnings", icon: Wallet, label: "Earnings" },
    { to: "/profile", icon: User, label: "Profile" },
    ...(isAdmin ? [{ to: "/admin", icon: Shield, label: "Admin" }] : []),
  ];

  const handleSignOut = async () => { await signOut(); navigate("/login"); };

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-bold text-lg leading-none">Rasgoal</div>
          <div className="text-xs text-muted-foreground">Affiliate Portal</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              )
            }
          >
            <n.icon className="w-4 h-4" />
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" /> Sign out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 flex flex-col lg:hidden">
            {SidebarContent}
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Rasgoal Affiliate</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </Button>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
