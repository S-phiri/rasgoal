import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, username: string) => Promise<void>;
  signIn: (emailOrUsername: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const tryLinkReferral = async () => {
      const refCode = localStorage.getItem("rasgoal_ref_code");
      if (!refCode) return;
      try {
        await supabase.rpc("link_referral_by_code", { _code: refCode });
        localStorage.removeItem("rasgoal_ref_code");
      } catch (e) {
        // Keep code in storage so we can retry on the next session change.
        console.warn("Referral linking failed; will retry on next sign-in", e);
      }
    };

    const tryPersistAttribution = async (currentUser: User) => {
      try {
        const raw = localStorage.getItem("rasgoal_signup_attribution");
        if (!raw) return;
        const meta = (currentUser.user_metadata ?? {}) as Record<string, unknown>;
        if (meta.signup_attribution) {
          localStorage.removeItem("rasgoal_signup_attribution");
          return;
        }
        const attribution = JSON.parse(raw);
        const { error } = await supabase.auth.updateUser({ data: { signup_attribution: attribution } });
        if (!error) localStorage.removeItem("rasgoal_signup_attribution");
      } catch (e) {
        console.warn("Failed to persist signup attribution", e);
      }
    };


    const applyVerifiedSession = async (nextSession: Session | null) => {
      if (!nextSession) {
        if (!isMounted) return;
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user || data.user.id !== nextSession.user.id) {
        await supabase.auth.signOut();
        if (!isMounted) return;
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      if (!isMounted) return;
      setSession(nextSession);
      setUser(data.user);
      setLoading(false);
      setTimeout(tryLinkReferral, 0);
      setTimeout(() => void tryPersistAttribution(data.user), 0);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      // Defer to avoid running auth calls inside the auth callback.
      setTimeout(() => void applyVerifiedSession(session), 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      void applyVerifiedSession(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, username: string) => {
    // Check username uniqueness first
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", username)
      .maybeSingle();
    if (existing) throw new Error("Username is already taken. Please choose another.");

    let signupAttribution: unknown = undefined;
    try {
      const raw = localStorage.getItem("rasgoal_signup_attribution");
      if (raw) signupAttribution = JSON.parse(raw);
    } catch { /* ignore */ }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username, ...(signupAttribution ? { signup_attribution: signupAttribution } : {}) },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signIn = async (emailOrUsername: string, password: string) => {
    let email = emailOrUsername;
    // If input doesn't look like an email, resolve username to email
    if (!emailOrUsername.includes("@")) {
      const { data, error: fnError } = await supabase.rpc("find_email_by_username", { _username: emailOrUsername });
      if (fnError || !data) throw new Error("Username not found.");
      email = data;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };


  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const deleteAccount = async () => {
    const { error } = await supabase.functions.invoke("delete-account", { method: "POST" });
    if (error) throw error;
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
