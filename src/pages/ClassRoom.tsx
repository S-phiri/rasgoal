import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useLiveClass } from "@/hooks/useLiveClasses";
import { useNow } from "@/hooks/useNow";
import { canJoinClass } from "@/lib/classTime";
import JitsiRoom from "@/components/JitsiRoom";

const ClassRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { liveClass, loading } = useLiveClass(id);
  const now = useNow(15000);

  const isTeacher = !!liveClass && !!user && liveClass.teacher_id === user.id;
  const allowed = !!liveClass && (isTeacher || canJoinClass(liveClass, now));


  useEffect(() => {
    if (!liveClass || !user || isTeacher) return;
    // mark joined_at for student
    supabase
      .from("live_class_assignments")
      .update({ joined_at: new Date().toISOString() })
      .eq("class_id", liveClass.id)
      .eq("student_id", user.id)
      .then(() => {});
  }, [liveClass, user, isTeacher]);

  useEffect(() => {
    if (isTeacher && liveClass && liveClass.status === "scheduled") {
      supabase.from("live_classes").update({ status: "live" }).eq("id", liveClass.id).then(() => {});
    }
  }, [isTeacher, liveClass]);

  if (loading || !liveClass) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-4">
        <h1 className="font-display font-bold text-xl">The class isn't open yet</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          You can join from 10 minutes before the start time until the class ends.
        </p>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
            <ArrowLeft className="w-4 h-4" />Leave
          </Button>
          <h1 className="font-display font-bold text-foreground truncate">{liveClass.title}</h1>
          <div className="w-16" />
        </div>
      </div>
      <JitsiRoom
        roomName={liveClass.room_name}
        displayName={profile?.full_name || user?.email || "Guest"}
        email={user?.email || undefined}
        onLeave={() => navigate(-1)}
      />
    </div>
  );
};

export default ClassRoom;
