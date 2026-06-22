import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Ctx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAffiliate: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AffiliateAuthContext = createContext<Ctx>({} as Ctx);
export const useAffiliateAuth = () => useContext(AffiliateAuthContext);

export const AffiliateAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadRoles = async (uid: string | undefined) => {
    if (!uid) { setIsAffiliate(false); setIsAdmin(false); return; }
    const [{ data: roleData }, { data: affRow }] = await Promise.all([
      (supabase as any).from("user_roles").select("role").eq("user_id", uid),
      (supabase as any).from("affiliates").select("id,status").eq("user_id", uid).maybeSingle(),
    ]);
    const roles = (roleData || []).map((r: any) => r.role);
    const admin = roles.includes("affiliate_admin");
    setIsAdmin(admin);
    setIsAffiliate(admin || (!!affRow && affRow.status === "active"));
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s); setUser(s?.user ?? null);
      if (s?.user) {
        setLoading(true);
        setTimeout(async () => {
          await loadRoles(s.user.id);
          setLoading(false);
        }, 0);
      } else {
        setIsAffiliate(false);
        setIsAdmin(false);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s); setUser(s?.user ?? null);
      await loadRoles(s?.user?.id);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const refresh = async () => loadRoles(user?.id);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Enforce: only invited affiliates may access the portal, even if they
    // have a valid Rasgoal student account.
    const uid = data.user?.id;
    if (!uid) throw new Error("Sign-in failed");
    const [{ data: roleData }, { data: affRow }] = await Promise.all([
      (supabase as any).from("user_roles").select("role").eq("user_id", uid),
      (supabase as any).from("affiliates").select("status").eq("user_id", uid).maybeSingle(),
    ]);
    const roles = (roleData || []).map((r: any) => r.role);
    const isAdminRole = roles.includes("affiliate_admin");
    const isActiveAff = !!affRow && affRow.status === "active";
    if (!isAdminRole && !isActiveAff) {
      await supabase.auth.signOut();
      throw new Error("This account is not registered as an affiliate. Ask the Rasgoal admin to invite you first.");
    }
  };
  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <AffiliateAuthContext.Provider value={{ user, session, loading, isAffiliate, isAdmin, refresh, signIn, signOut }}>
      {children}
    </AffiliateAuthContext.Provider>
  );
};
