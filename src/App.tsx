import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import VerifyEmail from "./pages/VerifyEmail.tsx";
import Subscribe from "./pages/Subscribe.tsx";
import PaymentCallback from "./pages/PaymentCallback.tsx";
import RoleSelect from "./pages/RoleSelect.tsx";
import TeacherDashboard from "./pages/TeacherDashboard.tsx";
import TeacherStudentDetail from "./pages/TeacherStudentDetail.tsx";
import TeacherTestsList from "./pages/TeacherTestsList.tsx";
import TeacherTestBuilder from "./pages/TeacherTestBuilder.tsx";
import TeacherTestResults from "./pages/TeacherTestResults.tsx";
import StudentAssignments from "./pages/StudentAssignments.tsx";
import Messages from "./pages/Messages.tsx";
import Profile from "./pages/Profile.tsx";
import Grade12Index from "./pages/Grade12Index.tsx";
import AlevelsIndex from "./pages/AlevelsIndex.tsx";
import TeacherClasses from "./pages/TeacherClasses.tsx";
import TeacherClassForm from "./pages/TeacherClassForm.tsx";
import TeacherClassDetail from "./pages/TeacherClassDetail.tsx";
import StudentClasses from "./pages/StudentClasses.tsx";
import StudentClassDetail from "./pages/StudentClassDetail.tsx";
import ClassRoom from "./pages/ClassRoom.tsx";
import NotFound from "./pages/NotFound.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import Terms from "./pages/Terms.tsx";
import AdminSubscriptions from "./pages/AdminSubscriptions.tsx";

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!role) return <Navigate to="/select-role" replace />;
  if (role === "teacher") return <Navigate to="/teacher" replace />;
  return <>{children}</>;
};

const TeacherRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!role) return <Navigate to="/select-role" replace />;
  if (role !== "teacher") return <Navigate to="/" replace />;
  return <>{children}</>;
};

const RoleRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  // If the user has no role yet, let them pick one (avoids redirect loop with ProtectedRoute)
  if (!role) return <>{children}</>;
  if (role === "teacher") return <Navigate to="/teacher" replace />;
  return <Navigate to="/" replace />;
};

const AuthOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/select-role" element={<RoleRoute><RoleSelect /></RoleRoute>} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
            <Route path="/payment/dpo/callback" element={<PaymentCallback />} />
            <Route path="/grade-12" element={<ProtectedRoute><Grade12Index /></ProtectedRoute>} />
            <Route path="/a-levels" element={<ProtectedRoute><AlevelsIndex /></ProtectedRoute>} />
            <Route path="/teacher" element={<TeacherRoute><TeacherDashboard /></TeacherRoute>} />
            <Route path="/teacher/student/:studentId" element={<TeacherRoute><TeacherStudentDetail /></TeacherRoute>} />
            <Route path="/teacher/tests" element={<TeacherRoute><TeacherTestsList /></TeacherRoute>} />
            <Route path="/teacher/tests/new" element={<TeacherRoute><TeacherTestBuilder /></TeacherRoute>} />
            <Route path="/teacher/tests/:testId" element={<TeacherRoute><TeacherTestBuilder /></TeacherRoute>} />
            <Route path="/teacher/tests/:testId/results" element={<TeacherRoute><TeacherTestResults /></TeacherRoute>} />
            <Route path="/assignments" element={<ProtectedRoute><StudentAssignments /></ProtectedRoute>} />
            <Route path="/classes" element={<ProtectedRoute><StudentClasses /></ProtectedRoute>} />
            <Route path="/classes/:id" element={<ProtectedRoute><StudentClassDetail /></ProtectedRoute>} />
            <Route path="/classes/:id/room" element={<AuthOnlyRoute><ClassRoom /></AuthOnlyRoute>} />
            <Route path="/teacher/classes" element={<TeacherRoute><TeacherClasses /></TeacherRoute>} />
            <Route path="/teacher/classes/new" element={<TeacherRoute><TeacherClassForm /></TeacherRoute>} />
            <Route path="/teacher/classes/:id" element={<TeacherRoute><TeacherClassDetail /></TeacherRoute>} />
            <Route path="/teacher/classes/:id/edit" element={<TeacherRoute><TeacherClassForm /></TeacherRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/teacher/messages" element={<TeacherRoute><Messages /></TeacherRoute>} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin/subscriptions" element={<AuthOnlyRoute><AdminSubscriptions /></AuthOnlyRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
