"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, LoginResponse, RegisterResponse } from "@/state/api";

interface User {
  id: number;
  email: string;
  rol: "ADMIN" | "USER";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 🔄 Restaurar sesión si ya existe en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  // ---------------------------
  // 🔑 LOGIN
  // ---------------------------
  const login = async (email: string, password: string) => {
    try {
      const data: LoginResponse = await authApi.login({ email, password });

      // Guardar token
      setToken(data.token);
      localStorage.setItem("token", data.token);

      // Guardar user
      const user: User = {
        id: data.id,
        email: data.email,
        rol: data.rol,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  // ---------------------------
  // 📝 REGISTER
  // ---------------------------
  const register = async (nombre: string, email: string, password: string) => {
    try {
      const data: RegisterResponse = await authApi.register({
        nombre,
        email,
        password,
      });

      // Guardar token
      setToken(data.token);
      localStorage.setItem("token", data.token);

      // Guardar user
      const user: User = {
        id: data.id,
        email: data.email,
        rol: data.rol,
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      return true;
    } catch (error) {
      console.error("Error en registro:", error);
      return false;
    }
  };

  // ---------------------------
  // 🚪 LOGOUT
  // ---------------------------
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe estar dentro de AuthProvider");
  return ctx;
};



