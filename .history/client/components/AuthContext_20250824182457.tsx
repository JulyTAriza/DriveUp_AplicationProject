"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { authApi } from "@/state/api";

interface User {
  id: number;
  email: string;
  rol: "ADMIN" | "USER";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });

      // ✅ Guardamos el token
      setToken(data.token);
      localStorage.setItem("token", data.token);

      // ⚠️ Como el backend NO devuelve user, lo simulamos por ahora
      const fakeUser: User = { id: 0, email, rol: "USER" };
      setUser(fakeUser);
      localStorage.setItem("user", JSON.stringify(fakeUser));

      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe estar dentro de AuthProvider");
  return ctx;
};

