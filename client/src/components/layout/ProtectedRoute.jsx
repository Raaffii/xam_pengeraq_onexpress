import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { UnauthorizedPage } from "../ErrorPage";

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // Role restricted
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <UnauthorizedPage />;
  }

  return children;
};
