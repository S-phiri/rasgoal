export interface RewardDefinition {
  id: string;
  type: "badge" | "trophy" | "star" | "coin";
  name: string;
  icon: string;
  description: string;
}

export const REWARD_DEFINITIONS: RewardDefinition[] = [
  { id: "first_quiz", type: "badge", name: "First Steps", icon: "🎯", description: "Complete your first quiz" },
  { id: "streak_3", type: "badge", name: "On Fire", icon: "🔥", description: "3-day streak" },
  { id: "streak_7", type: "trophy", name: "Weekly Warrior", icon: "⚔️", description: "7-day streak" },
  { id: "streak_14", type: "trophy", name: "Two-Week Titan", icon: "🛡️", description: "14-day streak" },
  { id: "streak_30", type: "trophy", name: "Monthly Master", icon: "👑", description: "30-day streak" },
  { id: "perfect_score", type: "star", name: "Perfect Score", icon: "⭐", description: "100% on a quiz" },
  { id: "accuracy_90", type: "star", name: "Sharp Mind", icon: "🧠", description: "90%+ accuracy on a quiz" },
  { id: "total_50", type: "coin", name: "Half Century", icon: "🥉", description: "50 correct answers total" },
  { id: "total_100", type: "coin", name: "Century Club", icon: "🥈", description: "100 correct answers total" },
  { id: "total_250", type: "coin", name: "Knowledge King", icon: "🥇", description: "250 correct answers total" },
  { id: "subject_25", type: "badge", name: "Quarter Way", icon: "🌱", description: "25% progress in a subject" },
  { id: "subject_50", type: "badge", name: "Halfway Hero", icon: "🌿", description: "50% progress in a subject" },
  { id: "subject_75", type: "star", name: "Almost There", icon: "🌳", description: "75% progress in a subject" },
  { id: "subject_100", type: "trophy", name: "Subject Master", icon: "🏆", description: "100% in a subject" },
  { id: "five_quizzes", type: "badge", name: "Quiz Fan", icon: "📝", description: "Complete 5 quizzes" },
  { id: "ten_quizzes", type: "trophy", name: "Quiz Champion", icon: "🏅", description: "Complete 10 quizzes" },
];

export function getRewardById(id: string): RewardDefinition | undefined {
  return REWARD_DEFINITIONS.find((r) => r.id === id);
}
