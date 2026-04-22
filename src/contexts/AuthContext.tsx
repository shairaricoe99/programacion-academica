import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "secretaria" | "docente";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  roleLabel: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simulated users for demo
const DEMO_USERS: Record<string, AuthUser & { password: string }> = {
  "admin@unilibre.edu.co": {
    name: "Shaira Rico",
    email: "admin@unilibre.edu.co",
    role: "admin",
    initials: "SR",
    roleLabel: "Administrador del Sistema",
    password: "admin123",
  },
  "secretaria@unilibre.edu.co": {
    name: "María Acosta",
    email: "secretaria@unilibre.edu.co",
    role: "secretaria",
    initials: "MA",
    roleLabel: "Secretaría Académica",
    password: "sec123",
  },
  "docente@unilibre.edu.co": {
    name: "Ing. Luis Ramírez",
    email: "docente@unilibre.edu.co",
    role: "docente",
    initials: "LR",
    roleLabel: "Docente · Ing. Sistemas",
    password: "doc123",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, _password: string): boolean => {
    const found = DEMO_USERS[email.toLowerCase()];
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
