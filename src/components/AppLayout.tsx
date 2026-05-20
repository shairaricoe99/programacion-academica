import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Users,
  Building2,
  FileText,
  BarChart3,
  AlertTriangle,
  Shield,
  Clock,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Sparkles,
} from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import uniLogo from "@/assets/unilibre-logo.png";
import CommandPalette from "@/components/CommandPalette";
import { useUnreadCount } from "@/pages/Notificaciones";

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Inicio", path: "/", icon: <Home size={20} /> },
    { label: "Alertas de Conflictos", path: "/alertas", icon: <AlertTriangle size={20} /> },
    { label: "Estadísticas de Salones", path: "/estadisticas", icon: <BarChart3 size={20} /> },
    { label: "Usuarios y Roles", path: "/usuarios", icon: <Shield size={20} /> },
    { label: "Asistente IA", path: "/asistente", icon: <Sparkles size={20} /> },
  ],
  secretaria: [
    { label: "Inicio", path: "/", icon: <Home size={20} /> },
    { label: "Programación Académica", path: "/programacion", icon: <CalendarDays size={20} /> },
    { label: "Docente y Disponibilidad", path: "/docentes", icon: <Users size={20} /> },
    { label: "Infraestructura", path: "/salones", icon: <Building2 size={20} /> },
    { label: "Asignaturas y Grupos", path: "/asignaturas", icon: <FileText size={20} /> },
    { label: "Consultas y Reportes", path: "/reportes", icon: <BarChart3 size={20} /> },
    { label: "Conflictos", path: "/conflictos", icon: <AlertTriangle size={20} /> },
    { label: "Asistente IA", path: "/asistente", icon: <Sparkles size={20} /> },
  ],
  docente: [
    { label: "Inicio", path: "/", icon: <Home size={20} /> },
    { label: "Mi Horario", path: "/mi-horario", icon: <CalendarDays size={20} /> },
    { label: "Disponibilidad", path: "/disponibilidad", icon: <Clock size={20} /> },
    { label: "Asistente IA", path: "/asistente", icon: <Sparkles size={20} /> },
  ],
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const unread = useUnreadCount();

  if (!user) return null;

  const navItems = navByRole[user.role];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-card pt-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden"
        >
          <X size={18} />
        </button>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 pt-2">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "border-primary/20 bg-accent text-primary"
                    : "border-transparent hover:border-border hover:bg-muted/50"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }
                >
                  {item.icon}
                </span>

                <span className="flex-1">{item.label}</span>

                {isActive && (
                  <div className="h-6 w-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-4 py-3">
          <Link
            to="/configuracion"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-2 text-xs transition-colors ${
              location.pathname === "/configuracion"
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings size={16} />
            configuración
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header
          className="flex h-[72px] items-center gap-4 px-4 lg:px-6"
          style={{
            background:
              "linear-gradient(135deg, hsl(358 90% 38%), hsl(358 85% 45%))",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-white/80 hover:text-white lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={uniLogo}
              alt="Universidad Libre"
              className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
            />

            <span className="font-display text-xl font-extrabold text-white tracking-tight">
              Universidad Libre
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/notificaciones")}
              className="relative rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
              title="Notificaciones"
            >
              <Bell size={20} />

              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-destructive">
                  {unread}
                </span>
              )}
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
              title="Buscar (Ctrl+K)"
            >
              <Search size={20} />
            </button>

            <button
              onClick={() => navigate("/configuracion")}
              className="hidden sm:inline-flex rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
              title="Configuración"
            >
              <Settings size={20} />
            </button>

            <div className="ml-2 flex items-center gap-3">
              <button
                onClick={() => navigate("/configuracion")}
                className="h-10 w-10 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                title="Mi cuenta"
              >
                <span className="text-sm font-bold text-white">
                  {user.initials}
                </span>
              </button>

              <div className="hidden sm:block">
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-[11px] text-white/70">
                  {user.roleLabel}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}