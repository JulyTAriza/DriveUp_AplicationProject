"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Rol = "USER" | "ADMIN";

type User = {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<boolean>;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 Simulación de persistencia con localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("driveup_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const saveUser = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(!!userData);
    if (userData) {
      localStorage.setItem("driveup_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("driveup_user");
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 👇 Aquí luego reemplazamos con una llamada al backend (fetch/axios)
      if (email === "admin@driveup.com" && password === "admin") {
        saveUser({ id: 1, nombre: "Administrador", email, rol: "ADMIN" });
      } else {
        saveUser({ id: 2, nombre: "Usuario", email, rol: "USER" });
      }
      return true;
    } catch (error) {
      console.error("❌ Error en login:", error);
      return false;
    }
  };

  const register = async (
    nombre: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      // 🔹 Esto sería una llamada al backend
      saveUser({ id: Date.now(), nombre, email, rol: "USER" });
      return true;
    } catch (error) {
      console.error("❌ Error en registro:", error);
      return false;
    }
  };

  const logout = () => {
    saveUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return ctx;
};
