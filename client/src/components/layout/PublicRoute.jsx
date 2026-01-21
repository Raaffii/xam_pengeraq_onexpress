import { Navigate } from "react-router-dom";
import { authService } from "@/services/authService";

export const PublicRoute = ({ children }) => {
  const token = authService.getToken();
  if (token && authService.isAuthenticated()) {
    return <Navigate to='/' replace />;
  }

  return children;
};
