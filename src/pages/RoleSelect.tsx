import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen } from "lucide-react";
import { useUserRole, AppRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

const RoleSelect = () => {
  const navigate = useNavigate();
  const { setUserRole } = useUserRole();
  const [selecting, setSelecting] = useState(false);

  const handleSelect = async (role: AppRole) => {
    setSelecting(true);
    try {
      await setUserRole(role);
      toast.success(`Welcome! You're now set up as a ${role}.`);
      navigate(role === "teacher" ? "/teacher" : "/", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to set role");
    } finally {
      setSelecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-lg w-full text-center animate-slide-in">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
          🎓 Welcome to 7th Grade Quiz
        </h1>
        <p className="text-muted-foreground mb-8">
          How will you be using the app?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleSelect("student")}
            disabled={selecting}
            className="group p-6 rounded-2xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all duration-300 text-left"
          >
            <BookOpen className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-display font-bold text-lg text-foreground mb-1">
              I'm a Student
            </h3>
            <p className="text-sm text-muted-foreground">
              Take quizzes, earn badges, track your progress, and level up your learning.
            </p>
          </button>

          <button
            onClick={() => handleSelect("teacher")}
            disabled={selecting}
            className="group p-6 rounded-2xl border-2 border-accent/30 bg-accent/5 hover:bg-accent/10 hover:border-accent transition-all duration-300 text-left"
          >
            <GraduationCap className="w-10 h-10 text-accent mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-display font-bold text-lg text-foreground mb-1">
              I'm a Teacher
            </h3>
            <p className="text-sm text-muted-foreground">
              View student progress, track performance, and identify areas that need attention.
            </p>
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          You can add the other role later from your dashboard.
        </p>
      </div>
    </div>
  );
};

export default RoleSelect;
