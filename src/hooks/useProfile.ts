import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ProfileData {
  full_name: string | null;
  avatar_url: string | null;
  school: string | null;
  grade: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, school, grade")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) setProfile(data as unknown as ProfileData);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user) return null;
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = urlData.publicUrl + "?t=" + Date.now();

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setProfile((prev) => (prev ? { ...prev, avatar_url: url } : prev));
      return url;
    },
    [user]
  );

  return { profile, uploadAvatar, refetch: fetchProfile };
}
