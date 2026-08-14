import { createContext, useContext, useState, type ReactNode } from "react";
import api from "../services/api";

interface AuthUser {
  token: string;
  rol: string;
  nombre: string;
  apellido: string;
}

interface LoginRequest {
  dni: string;
  password: string;

}

interface AuthContextType {
  user: AuthUser | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(data: LoginRequest) {
    try {
      const response = await api.post<AuthUser>("/auth/login", data);

      localStorage.setItem("auth", JSON.stringify(response.data));
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem("auth");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}