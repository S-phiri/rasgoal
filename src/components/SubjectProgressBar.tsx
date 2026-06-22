import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface SubjectProgressBarProps {
  progress: number; // 0-1
  totalCorrect: number;
  totalAvailable: number;
  avatarUrl: string | null;
  subjectColor: string;
}

const colorClasses: Record<string, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  secondary: "bg-secondary",
  destructive: "bg-destructive",
  success: "bg-success",
};

const SubjectProgressBar = ({
  progress,
  totalCorrect,
  totalAvailable,
  avatarUrl,
  subjectColor,
}: SubjectProgressBarProps) => {
  const percentage = Math.round(progress * 100);
  const barColor = colorClasses[subjectColor] || "bg-primary";

  return (
    <div className="w-full">
      {/* Labels */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground font-medium">
          {totalCorrect} of {totalAvailable} correct
        </span>
        <span className="text-xs font-display font-bold text-foreground">{percentage}%</span>
      </div>

      {/* Progress bar with avatar */}
      <div className="relative h-5 w-full">
        {/* Track */}
        <div className="absolute inset-0 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
            style={{ width: `${Math.max(percentage, 2)}%` }}
          />
        </div>

        {/* Milestone markers */}
        {[25, 50, 75].map((m) => (
          <div
            key={m}
            className="absolute top-0 h-full w-0.5 bg-background/60"
            style={{ left: `${m}%` }}
          />
        ))}

        {/* Moving Avatar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
          style={{ left: `calc(${Math.min(percentage, 97)}% - 12px)` }}
        >
          <Avatar className="w-7 h-7 border-2 border-background shadow-md">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="You" />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Milestone labels */}
      <div className="flex justify-between mt-1 px-1">
        {[0, 25, 50, 75, 100].map((m) => (
          <span
            key={m}
            className={`text-[9px] ${
              percentage >= m ? "text-foreground font-semibold" : "text-muted-foreground"
            }`}
          >
            {m}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default SubjectProgressBar;
