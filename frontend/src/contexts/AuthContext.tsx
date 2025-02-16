import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get("/auth/me");
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        delete api.defaults.headers.common["Authorization"];
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      sessionStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    sessionStorage.setItem("token", token);
    setIsAuthenticated(true);
    await checkAuth();
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
