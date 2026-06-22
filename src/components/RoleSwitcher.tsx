import { useUserRole, AppRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const RoleSwitcher = () => {
  const { role, roles, switchRole, addRole } = useUserRole();
  const navigate = useNavigate();

  if (roles.length < 2) return null;

  const otherRole: AppRole = role === "teacher" ? "student" : "teacher";

  const handleSwitch = () => {
    switchRole(otherRole);
    toast.success(`Switched to ${otherRole} view`);
    navigate(otherRole === "teacher" ? "/teacher" : "/", { replace: true });
  };

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-border bg-card hover:bg-muted/50 transition-colors"
      title={`Switch to ${otherRole} view`}
    >
      {otherRole === "teacher" ? (
        <GraduationCap className="w-4 h-4 text-accent" />
      ) : (
        <BookOpen className="w-4 h-4 text-primary" />
      )}
      <span className="hidden sm:inline">Switch to {otherRole}</span>
    </button>
  );
};

export default RoleSwitcher;
