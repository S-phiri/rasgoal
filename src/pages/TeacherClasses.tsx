import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Video, Users, Calendar } from "lucide-react";
import { useTeacherClasses } from "@/hooks/useLiveClasses";
import { useNow } from "@/hooks/useNow";
import { canJoinClass, formatClassTime, isUpcoming } from "@/lib/classTime";

const TeacherClasses = () => {
  const navigate = useNavigate();
  const { classes, loading } = useTeacherClasses();
  const now = useNow();

  const { upcoming, past } = useMemo(() => {
    const up = classes.filter((c) => isUpcoming(c, now)).sort((a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
    const ps = classes.filter((c) => !isUpcoming(c, now));
    return { upcoming: up, past: ps };
  }, [classes, now]);

  const renderList = (list: typeof classes) => {
    if (loading) return <div className="text-center py-10 text-muted-foreground text-sm">Loading…</div>;
    if (list.length === 0)
      return (
        <div className="text-center py-10 bg-card rounded-xl border border-border">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No classes here yet.</p>
        </div>
      );

    return (
      <div className="space-y-3">
        {list.map((c) => {
          const joinable = canJoinClass(c, now);
          return (
            <button
              key={c.id}
              onClick={() => navigate(`/teacher/classes/${c.id}`)}
              className="w-full text-left bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold font-display text-foreground">{c.title}</h3>
                    {c.status === "cancelled" && <Badge variant="destructive" className="text-[10px]">Cancelled</Badge>}
                    {joinable && <Badge className="bg-success text-success-foreground text-[10px]">Live window</Badge>}
                    <Badge variant="outline" className="text-[10px]">
                      {c.class_type === "one_to_one" ? "1-on-1" : "Group"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatClassTime(c)}</p>
                  {(c.subject || c.grade || c.topic) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {[c.subject, c.grade && `Grade ${c.grade}`, c.topic].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <Video className="w-5 h-5 text-primary shrink-0 mt-1" />
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/teacher")} className="gap-1">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h1 className="font-display font-bold text-foreground">Live Classes</h1>
          </div>
          <Button size="sm" onClick={() => navigate("/teacher/classes/new")} className="gap-1">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">{renderList(upcoming)}</TabsContent>
          <TabsContent value="past">{renderList(past)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherClasses;
