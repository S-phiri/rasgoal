import { useEffect, useState } from "react";
import { RewardDefinition } from "@/lib/rewards";

interface CelebrationProps {
  type: "correct" | "streak" | "reward" | "complete";
  reward?: RewardDefinition;
  message?: string;
  onDone: () => void;
}

const CelebrationAnimation = ({ type, reward, message, onDone }: CelebrationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    emoji: ["🎉", "⭐", "✨", "💫", "🌟", "🎊"][Math.floor(Math.random() * 6)],
    size: 12 + Math.random() * 16,
  }));

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Confetti particles */}
      {(type === "reward" || type === "complete") &&
        particles.map((p, i) => (
          <span
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${p.x}%`,
              top: "-20px",
              fontSize: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: "1.5s",
            }}
          >
            {p.emoji}
          </span>
        ))}

      {/* Center card */}
      <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 text-center animate-scale-in max-w-xs mx-4">
        {type === "reward" && reward && (
          <>
            <span className="text-5xl block mb-2">{reward.icon}</span>
            <p className="font-display font-bold text-lg text-foreground">
              Reward Earned!
            </p>
            <p className="text-sm text-primary font-semibold">{reward.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{reward.description}</p>
          </>
        )}
        {type === "streak" && (
          <>
            <span className="text-5xl block mb-2">🔥</span>
            <p className="font-display font-bold text-lg text-foreground">Streak Up!</p>
            <p className="text-sm text-muted-foreground">{message}</p>
          </>
        )}
        {type === "correct" && (
          <>
            <span className="text-4xl block mb-1">✨</span>
            <p className="font-display font-bold text-foreground">Correct!</p>
          </>
        )}
        {type === "complete" && (
          <>
            <span className="text-5xl block mb-2">🎓</span>
            <p className="font-display font-bold text-lg text-foreground">Subject Complete!</p>
            <p className="text-sm text-muted-foreground">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CelebrationAnimation;
