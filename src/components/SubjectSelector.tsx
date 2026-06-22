import { subjects, Subject, getSubjectTestInfo } from "@/data/questions";
import { useMemo } from "react";
import UserMenu from "@/components/UserMenu";
import StreakCard from "@/components/StreakCard";
import RewardBadges from "@/components/RewardBadges";
import SubjectProgressBar from "@/components/SubjectProgressBar";
import AvatarUpload from "@/components/AvatarUpload";
import StudentTeacherManager from "@/components/StudentTeacherManager";
import UpcomingClassesCard from "@/components/UpcomingClassesCard";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { usePendingAssignmentsCount } from "@/hooks/usePendingAssignmentsCount";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import type { useStreak } from "@/hooks/useStreak";
import type { useRewards } from "@/hooks/useRewards";
import type { useSubjectProgress } from "@/hooks/useSubjectProgress";
import type { useProfile } from "@/hooks/useProfile";

interface SubjectSelectorProps {
  onSelect: (subject: Subject) => void;
  streak: ReturnType<typeof useStreak>;
  rewards: ReturnType<typeof useRewards>;
  progress: ReturnType<typeof useSubjectProgress>;
  profile: ReturnType<typeof useProfile>;
}

const colorMap: Record<string, string> = {
  primary: "border-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/80",
  accent: "border-accent bg-accent/5 hover:bg-accent/10 hover:border-accent/80",
  secondary: "border-secondary bg-secondary/5 hover:bg-secondary/10 hover:border-secondary/80",
  destructive: "border-destructive bg-destructive/5 hover:bg-destructive/10 hover:border-destructive/80",
  success: "border-success bg-success/5 hover:bg-success/10 hover:border-success/80",
};

const SubjectSelector = ({ onSelect, streak, rewards, progress, profile }: SubjectSelectorProps) => {
  const pendingCount = usePendingAssignmentsCount();
  const { count: unreadMsgCount } = useUnreadMessages();
  const totalBadge = pendingCount + unreadMsgCount;

  const sortedSubjects = useMemo(() => {
    return [...subjects]
      .map((subject) => {
        const info = getSubjectTestInfo(subject.id);
        const availableCount = info.filter((t) => t.isAvailable).length;
        return { ...subject, availableCount };
      })
      .sort((a, b) => b.availableCount - a.availableCount);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 relative">
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AvatarUpload
            avatarUrl={profile.profile?.avatar_url || null}
            onUpload={profile.uploadAvatar}
            size="sm"
          />
          <div>
            <h1 className="text-xl font-bold font-display text-foreground leading-tight">
              🎓 7th Grade Quiz
            </h1>
            <p className="text-xs text-muted-foreground">
              {profile.profile?.full_name ? `Welcome back, ${profile.profile.full_name}!` : "Choose a subject to start!"}
            </p>
          </div>
        </div>
        <UserMenu />
      </div>

      {/* Dashboard cards */}
      <div className="w-full max-w-3xl space-y-4 mb-6">
        <StreakCard streak={streak.streak} />
        <RewardBadges earned={rewards.earned} />
        <UpcomingClassesCard variant="student" />
        <StudentTeacherManager />
      </div>

      {/* Grade switcher & Assignments */}
      <div className="w-full max-w-3xl mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="font-semibold text-foreground">7th Grade</span>
          <span className="text-muted-foreground">/</span>
          <Link to="/grade-12" className="text-muted-foreground hover:text-foreground transition-colors">
            12th Grade
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/a-levels" className="text-muted-foreground hover:text-foreground transition-colors">
            A-Levels
          </Link>
        </div>
        <Link to="/assignments" className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5">
          📋 Assignments
          {totalBadge > 0 && (
            <Badge className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {totalBadge}
            </Badge>
          )}
          {unreadMsgCount > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
              💬 {unreadMsgCount}
            </Badge>
          )}
        </Link>
      </div>

      {/* Subject heading */}
      <div className="text-center mb-6 animate-slide-in max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-1">
          Choose a Subject
        </h2>
        <p className="text-muted-foreground text-sm">
          Test your knowledge with 50 questions per quiz!
        </p>
      </div>

      {/* Subject cards with progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl w-full">
        {sortedSubjects.map((subject, i) => {
          const sp = progress.progress[subject.id];
          const hasTests = subject.availableCount > 0;
          return (
            <button
              key={subject.id}
              onClick={() => onSelect(subject)}
              className={`group relative p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer text-left ${colorMap[subject.color]} ${!hasTests ? "opacity-60" : ""} animate-slide-in`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {hasTests && (
                <span className="absolute top-2 right-2 text-[10px] font-semibold bg-success/20 text-success px-1.5 py-0.5 rounded-full border border-success/30">
                  {subject.availableCount} tests
                </span>
              )}
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform duration-200">
                {subject.icon}
              </span>
              <h3 className="font-display font-bold text-base text-foreground mb-1">
                {subject.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {subject.description}
              </p>
              {sp && (
                <SubjectProgressBar
                  progress={sp.progress}
                  totalCorrect={sp.totalCorrect}
                  totalAvailable={sp.totalAvailable}
                  avatarUrl={profile.profile?.avatar_url || null}
                  subjectColor={subject.color}
                />
              )}
              {sp && sp.quizzesTaken > 0 && (
                <p className="text-[10px] text-muted-foreground mt-2">
                  📝 {sp.quizzesTaken} quiz{sp.quizzesTaken !== 1 ? "zes" : ""} taken · Best: {sp.bestScore}/50
                </p>
              )}
              {!hasTests && (
                <p className="text-[10px] text-muted-foreground/70 italic">Coming soon</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;
