import { useState } from "react";
import { EarnedReward } from "@/hooks/useRewards";
import { REWARD_DEFINITIONS, getRewardById } from "@/lib/rewards";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RewardBadgesProps {
  earned: EarnedReward[];
  compact?: boolean;
}

const RewardBadges = ({ earned, compact = false }: RewardBadgesProps) => {
  const [expanded, setExpanded] = useState(false);
  const earnedIds = new Set(earned.map((e) => e.reward_id));

  if (compact) {
    if (earned.length === 0) return null;
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {earned.slice(0, 8).map((e) => {
          const def = getRewardById(e.reward_id);
          return (
            <span key={e.reward_id} className="text-xl cursor-default" title={def?.name || e.reward_name}>
              {def?.icon || "🏅"}
            </span>
          );
        })}
        {earned.length > 8 && (
          <span className="text-xs text-muted-foreground ml-1">+{earned.length - 8}</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
      {/* Compact header row — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-foreground text-sm flex items-center gap-2">
            🏅 Rewards
            <span className="text-xs font-normal text-muted-foreground">
              {earned.length}/{REWARD_DEFINITIONS.length}
            </span>
          </h3>
          {/* Preview of earned badges inline */}
          {!expanded && earned.length > 0 && (
            <div className="flex items-center gap-0.5 ml-1">
              {earned.slice(0, 6).map((e) => {
                const def = getRewardById(e.reward_id);
                return (
                  <span key={e.reward_id} className="text-base" title={def?.name || e.reward_name}>
                    {def?.icon || "🏅"}
                  </span>
                );
              })}
              {earned.length > 6 && (
                <span className="text-[10px] text-muted-foreground ml-0.5">+{earned.length - 6}</span>
              )}
            </div>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-3 space-y-3 animate-slide-in">
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5">
            {REWARD_DEFINITIONS.map((reward) => {
              const isEarned = earnedIds.has(reward.id);
              return (
                <div
                  key={reward.id}
                  className={`flex flex-col items-center p-1.5 rounded-lg text-center transition-all ${
                    isEarned
                      ? "bg-secondary/10 border border-secondary/30"
                      : "bg-muted/50 opacity-40 grayscale"
                  }`}
                  title={`${reward.name}: ${reward.description}`}
                >
                  <span className="text-xl mb-0.5">{reward.icon}</span>
                  <span className="text-[9px] leading-tight text-foreground font-medium">
                    {reward.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Next reward hint */}
          {earned.length < REWARD_DEFINITIONS.length && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
              ✨ Next:{" "}
              <strong>{REWARD_DEFINITIONS.find((r) => !earnedIds.has(r.id))?.name}</strong>{" "}
              — {REWARD_DEFINITIONS.find((r) => !earnedIds.has(r.id))?.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RewardBadges;
