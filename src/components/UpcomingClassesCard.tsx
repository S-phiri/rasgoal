import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar } from "lucide-react";
import { useStudentClasses, useTeacherClasses } from "@/hooks/useLiveClasses";
import { useNow } from "@/hooks/useNow";
import { canJoinClass, formatClassTime, isUpcoming } from "@/lib/classTime";

interface Props {
  variant: "student" | "teacher";
}

const UpcomingClassesCard = ({ variant }: Props) => {
  const studentHook = useStudentClasses();
  const teacherHook = useTeacherClasses();
  const { classes, loading } = variant === "student" ? studentHook : teacherHook;
  const now = useNow();

  const upcoming = useMemo(() => classes
    .filter((c) => isUpcoming(c, now))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 3),
  [classes, now]);

  const allHref = variant === "student" ? "/classes" : "/teacher/classes";
  const detailBase = variant === "student" ? "/classes" : "/teacher/classes";

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold flex items-center gap-2 text-foreground">
          <Video className="w-4 h-4 text-primary" /> Live Classes
        </h3>
        <Link to={allHref} className="text-xs text-primary hover:underline">View all</Link>
      </div>
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading…</p>
      ) : upcoming.length === 0 ? (
        <div className="text-center py-4">
          <Calendar className="w-7 h-7 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">No upcoming classes.</p>
          {variant === "teacher" && (
            <Link to="/teacher/classes/new">
              <Button size="sm" variant="outline" className="mt-2">Schedule one</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map((c) => {
            const joinable = canJoinClass(c, now);
            return (
              <Link
                key={c.id}
                to={`${detailBase}/${c.id}`}
                className="block p-2.5 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{formatClassTime(c)}</p>
                  </div>
                  {joinable && <Badge className="bg-success text-success-foreground text-[10px] shrink-0">Live</Badge>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingClassesCard;
