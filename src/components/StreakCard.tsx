import { StreakData } from "@/hooks/useStreak";
import { Flame, Snowflake, Trophy } from "lucide-react";

interface StreakCardProps {
  streak: StreakData | null;
}

const StreakCard = ({ streak }: StreakCardProps) => {
  if (!streak) return null;

  const messages = [
    streak.current_streak >= 30 && "🏆 Legendary! 30+ day streak!",
    streak.current_streak >= 14 && "⚡ Unstoppable! Two weeks strong!",
    streak.current_streak >= 7 && "🔥 Amazing! A full week!",
    streak.current_streak >= 5 && `You're on a ${streak.current_streak}-day streak!`,
    streak.current_streak >= 3 && "Nice! Keep it going!",
    streak.current_streak >= 1 && "Great start! Come back tomorrow!",
  ].find(Boolean) || "Start learning to build your streak!";

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="font-display font-bold text-foreground text-lg leading-tight">
              {streak.current_streak} Day{streak.current_streak !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {streak.streak_freeze_available && (
            <div className="flex items-center gap-1 text-xs text-accent" title="Streak freeze available">
              <Snowflake className="w-4 h-4" />
              <span className="hidden sm:inline">Freeze</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground" title="Longest streak">
            <Trophy className="w-3 h-3" />
            <span>{streak.longest_streak} best</span>
          </div>
        </div>
      </div>

      {/* Streak dots */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all ${
              i < Math.min(streak.current_streak, 7)
                ? "bg-destructive"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{messages}</p>
      <div className="mt-2 text-xs text-muted-foreground">
        🎯 {streak.total_correct_answers} correct answers total
      </div>
    </div>
  );
};

export default StreakCard;
