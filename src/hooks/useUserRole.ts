import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "student" | "teacher";

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async () => {
    if (!user) { setRole(null); setRoles([]); setLoading(false); return; }
    const { data } = await (supabase as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    
    const allRoles = (data || []).map((d: any) => d.role as AppRole);
    setRoles(allRoles);
    // Default to first role or stored preference
    const stored = localStorage.getItem(`active_role_${user.id}`);
    if (stored && allRoles.includes(stored as AppRole)) {
      setRole(stored as AppRole);
    } else {
      setRole(allRoles[0] || null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchRole(); }, [fetchRole]);

  const setUserRole = async (newRole: AppRole) => {
    if (!user) return;
    const { error } = await (supabase as any).from("user_roles").insert({
      user_id: user.id,
      role: newRole,
    });
    if (error) throw error;
    setRole(newRole);
    setRoles((prev) => [...prev, newRole]);
    localStorage.setItem(`active_role_${user.id}`, newRole);
  };

  const switchRole = (newRole: AppRole) => {
    if (!user || !roles.includes(newRole)) return;
    setRole(newRole);
    localStorage.setItem(`active_role_${user.id}`, newRole);
  };

  const addRole = async (newRole: AppRole) => {
    if (!user || roles.includes(newRole)) return;
    const { error } = await (supabase as any).from("user_roles").insert({
      user_id: user.id,
      role: newRole,
    });
    if (error) throw error;
    setRoles((prev) => [...prev, newRole]);
  };

  return { role, roles, loading, setUserRole, switchRole, addRole, refetch: fetchRole };
};
