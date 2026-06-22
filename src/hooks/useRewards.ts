import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { REWARD_DEFINITIONS, RewardDefinition } from "@/lib/rewards";

export interface EarnedReward {
  reward_id: string;
  reward_type: string;
  reward_name: string;
  earned_at: string;
}

export function useRewards() {
  const { user } = useAuth();
  const [earned, setEarned] = useState<EarnedReward[]>([]);
  const [newRewards, setNewRewards] = useState<RewardDefinition[]>([]);

  const fetchRewards = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("user_rewards")
      .select("reward_id, reward_type, reward_name, earned_at")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false });

    if (data) setEarned(data as unknown as EarnedReward[]);
  }, [user]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const checkAndAward = useCallback(
    async (context: {
      streakDays: number;
      totalCorrect: number;
      quizScore: number;
      quizTotal: number;
      quizCount: number;
      subjectProgress: Record<string, number>; // 0-1
    }) => {
      if (!user) return;
      const earnedIds = new Set(earned.map((e) => e.reward_id));
      const toAward: RewardDefinition[] = [];

      const check = (id: string) => !earnedIds.has(id);

      // Streak rewards
      if (check("streak_3") && context.streakDays >= 3) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "streak_3")!);
      if (check("streak_7") && context.streakDays >= 7) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "streak_7")!);
      if (check("streak_14") && context.streakDays >= 14) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "streak_14")!);
      if (check("streak_30") && context.streakDays >= 30) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "streak_30")!);

      // Quiz rewards
      if (check("first_quiz") && context.quizCount >= 1) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "first_quiz")!);
      if (check("five_quizzes") && context.quizCount >= 5) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "five_quizzes")!);
      if (check("ten_quizzes") && context.quizCount >= 10) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "ten_quizzes")!);

      // Score rewards
      const pct = context.quizTotal > 0 ? context.quizScore / context.quizTotal : 0;
      if (check("perfect_score") && pct === 1 && context.quizTotal > 0) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "perfect_score")!);
      if (check("accuracy_90") && pct >= 0.9 && context.quizTotal > 0) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "accuracy_90")!);

      // Total correct
      if (check("total_50") && context.totalCorrect >= 50) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "total_50")!);
      if (check("total_100") && context.totalCorrect >= 100) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "total_100")!);
      if (check("total_250") && context.totalCorrect >= 250) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "total_250")!);

      // Subject progress
      for (const progress of Object.values(context.subjectProgress)) {
        if (check("subject_25") && progress >= 0.25) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "subject_25")!);
        if (check("subject_50") && progress >= 0.5) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "subject_50")!);
        if (check("subject_75") && progress >= 0.75) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "subject_75")!);
        if (check("subject_100") && progress >= 1) toAward.push(REWARD_DEFINITIONS.find((r) => r.id === "subject_100")!);
      }

      // Deduplicate
      const unique = toAward.filter((r, i, a) => r && a.findIndex((x) => x.id === r.id) === i);

      if (unique.length > 0) {
        const rows = unique.map((r) => ({
          user_id: user.id,
          reward_type: r.type,
          reward_id: r.id,
          reward_name: r.name,
        }));
        await supabase.from("user_rewards").insert(rows as any);
        setNewRewards(unique);
        setEarned((prev) => [
          ...unique.map((r) => ({
            reward_id: r.id,
            reward_type: r.type,
            reward_name: r.name,
            earned_at: new Date().toISOString(),
          })),
          ...prev,
        ]);
      }

      return unique;
    },
    [user, earned]
  );

  const clearNewRewards = useCallback(() => setNewRewards([]), []);

  return { earned, newRewards, checkAndAward, clearNewRewards, refetch: fetchRewards };
}
