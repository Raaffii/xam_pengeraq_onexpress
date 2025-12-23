import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const authService = {
  getToken: () => Cookies.get("token"),

  setToken: (token) => {
    Cookies.set("token", token, {
      expires: 1,
      secure: true,
      sameSite: "Strict",
    });
  },

  removeToken: () => Cookies.remove("token"),

  saveLogin: (responseData) => {
    const token = responseData.data.token;
    authService.setToken(token);
  },

  logout: () => {
    authService.removeToken();
  },

  isAuthenticated: () => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        authService.removeToken();
        return false;
      }
      if (!decoded.userId || !decoded.iat || !decoded.jti) {
        authService.removeToken();
        return false;
      }
      return true;
    } catch {
      authService.removeToken();
      return false;
    }
  },

  getUser: () => {
    try {
      const token = authService.getToken();
      if (!token) return null;
      const decoded = jwtDecode(token);
      return {
        userId: decoded.userId,
        userName: decoded.userName,
        email: decoded.email,
      };
    } catch {
      return null;
    }
  },

  getTokenExpiry: () => {
    try {
      const token = authService.getToken();
      if (!token) return null;

      const decoded = jwtDecode(token);
      return decoded.exp ? decoded.exp * 1000 : null;
    } catch {
      return null;
    }
  },

  getTimeUntilExpiry: () => {
    const expiresAt = authService.getTokenExpiry();
    if (!expiresAt) return null;

    const timeRemaining = expiresAt - Date.now();
    return timeRemaining > 0 ? timeRemaining : 0;
  },

  isTokenExpired: () => {
    const expiresAt = authService.getTokenExpiry();
    if (!expiresAt) return true;

    return Date.now() >= expiresAt;
  },

  getTokenExpiryDate: () => {
    const expiresAt = authService.getTokenExpiry();
    return expiresAt ? new Date(expiresAt) : null;
  },
};
