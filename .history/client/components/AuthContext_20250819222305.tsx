"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: number;
  nombre: string;
  email: string;
  rol: "USER" | "ADMIN";
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => void;
  register: (nombre: string, email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  const login = (email: string, password: string) => {
    // 👇 Aquí luego llamamos al backend
    if (email === "admin@driveup.com" && password === "admin") {
      setUser({ id: 1, nombre: "Admin", email, rol: "ADMIN" });
    } else {
      setUser({ id: 2, nombre: "Usuario", email, rol: "USER" });
    }
  };

  const register = (nombre: string, email: string, password: string) => {
    // 👇 Simulación
    setUser({ id: 3, nombre, email, rol: "USER" });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
