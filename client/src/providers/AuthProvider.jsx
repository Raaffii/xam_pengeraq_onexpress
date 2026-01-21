import { createContext, useContext, useEffect, useState, useRef } from "react";
import { authService } from "@/services/authService";
import api from "@/utils/api";
import { handleServiceError } from "@/utils/errorHandler";
import { setupService } from "@/services/setupService";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [setup, setSetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    const setupAutoLogout = () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }

      const token = authService.getToken();
      if (!token) return;

      if (authService.isTokenExpired()) {
        logout();
        window.location.href = "/login";
        return;
      }

      const timeUntilExpiry = authService.getTimeUntilExpiry();
      if (timeUntilExpiry === null || timeUntilExpiry <= 0) {
        logout();
        window.location.href = "/login";
        return;
      }

      logoutTimerRef.current = setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, timeUntilExpiry);

      console.log(
        `Auto logout scheduled in ${Math.round(timeUntilExpiry / 1000)} seconds`
      );
    };

    setupAutoLogout();

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [user]);

  useEffect(() => {
    const token = authService.getToken();
    if (token && authService.isAuthenticated()) {
      setUser(authService.getUser());
      setSetup(setupService.getSetupData());
    } else if (token) {
      authService.logout();
    }
    setLoading(false);
  }, []);

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
          logout();
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const login = async (formData) => {
    try {
      const response = await api.post("/api/auth/login", formData);
      authService.saveLogin(response.data);
      const detailSetup = await setupService.getSetupById(1);
      setupService.setSetupData(detailSetup.data);

      setUser(authService.getUser());
      setSetup(setupService.getSetupData());
      return response.data;
    } catch (error) {
      console.error("login error: ", error);
      handleServiceError(error, "Login failed");
      throw error;
    }
  };

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    authService.logout();
    setupService.removeSetupData();
    setUser(null);
    setSetup(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
