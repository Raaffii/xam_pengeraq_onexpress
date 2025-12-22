import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user on mount
  useEffect(() => {
    const token = authService.getToken();
    if (token && authService.isAuthenticated()) {
      setUser(authService.getUser());
    }
    setLoading(false);
  }, []);

  // Handle token expiration
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;
        const code = error?.response?.data?.error?.code;
        const msg = error?.response?.data?.error?.message;

        const isTokenExpired =
          (status === 401 && code === "TOKEN_EXPIRED") ||
          msg === "Access token required";
        const isInvalidToken = status === 403 && code === "INVALID_TOKEN";

        if (isTokenExpired || isInvalidToken) {
          authService.logout();
          setUser(null);

          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }

        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const login = async (formData) => {
    try {
      const response = await api.post("/api/auth/login", formData);

      authService.saveLogin(response.data);
      setUser(authService.getUser());

      return response.data;
    } catch (error) {
      console.error("login error: ", error);
      handleServiceError(error, "Login failed");
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
