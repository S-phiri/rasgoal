import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_freeze_available: boolean;
  total_correct_answers: number;
}

export function useStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStreak = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setStreak(data as unknown as StreakData);
    } else {
      // Create initial streak record
      const initial: StreakData = {
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
        streak_freeze_available: true,
        total_correct_answers: 0,
      };
      await supabase.from("user_streaks").insert({ user_id: user.id });
      setStreak(initial);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const recordActivity = useCallback(
    async (correctAnswers: number) => {
      if (!user || !streak) return;

      const today = new Date().toISOString().split("T")[0];
      const lastDate = streak.last_activity_date;

      let newStreak = streak.current_streak;
      let freezeAvailable = streak.streak_freeze_available;

      if (lastDate === today) {
        // Already active today — just update total
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastDate === yesterdayStr) {
          newStreak += 1;
        } else if (lastDate && freezeAvailable) {
          // Missed a day but have freeze
          const twoDaysAgo = new Date();
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
          if (lastDate === twoDaysAgo.toISOString().split("T")[0]) {
            newStreak += 1;
            freezeAvailable = false;
          } else {
            newStreak = 1;
            freezeAvailable = true;
          }
        } else {
          newStreak = 1;
        }
      }

      const longestStreak = Math.max(streak.longest_streak, newStreak);
      const totalCorrect = streak.total_correct_answers + correctAnswers;

      await supabase
        .from("user_streaks")
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_activity_date: today,
          streak_freeze_available: freezeAvailable,
          total_correct_answers: totalCorrect,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("user_id", user.id);

      const updated: StreakData = {
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_activity_date: today,
        streak_freeze_available: freezeAvailable,
        total_correct_answers: totalCorrect,
      };
      setStreak(updated);
      return updated;
    },
    [user, streak]
  );

  return { streak, loading, recordActivity, refetch: fetchStreak };
}
