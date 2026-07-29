import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "mentor" | "learner" | "medical";
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // user.role from AuthContext is typed as 'mentor' | 'learner' but medical users
  // set role to 'medical' directly via localStorage, so we cast for runtime safety
  const userRole = (user as { role: string }).role;

  if (requiredRole && userRole !== requiredRole) {
    const roleRedirectMap: Record<string, string> = {
      mentor: "/mentor-dashboard",
      learner: "/learner-dashboard",
      medical: "/medical-dashboard",
    };
    const defaultRedirect = roleRedirectMap[userRole] || "/";
    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  return <>{children}</>;
}
