import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';


export type UserRole = 'registrar' | 'registrant' | 'admin' | 'office_manager' | 'health_institution' | 'court' | 'religious_institution';
// -------------------
// Types
// -------------------
interface User {
  id: string;
  indexNumber: string;
  name: string;
  email: string;
  role: string;
  institutionId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean; // <-- add this
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

// -------------------
// Context
// -------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------------------
// Provider
// -------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      if (response.data?.token) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.refreshToken(); // no args needed
      if (response.data?.token) {
        localStorage.setItem("authToken", response.data.token);
        return;
      }
      logout();
    } catch (error) {
      console.error("❌ Session refresh failed:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

// -------------------
// Hook
// -------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
