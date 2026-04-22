import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sun, Moon, User, Bell, Lock, Globe, Save, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Theme = "light" | "dark";

export default function Configuracion() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>(() =>
    (typeof window !== "undefined" && (localStorage.getItem("ul-theme") as Theme)) || "light"
  );
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifConflictos, setNotifConflictos] = useState(true);
  const [idioma, setIdioma] = useState("es");
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [pass, setPass] = useState({ actual: "", nueva: "", confirmar: "" });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("ul-theme", theme);
  }, [theme]);

  const guardarPerfil = () => toast.success("Perfil actualizado");
  const guardarNotifs = () => toast.success("Preferencias de notificación guardadas");
  const guardarPass = () => {
    if (!pass.actual || !pass.nueva || !pass.confirmar) return toast.error("Completa todos los campos");
    if (pass.nueva !== pass.confirmar) return toast.error("Las contraseñas no coinciden");
    if (pass.nueva.length < 6) return toast.error("La contraseña debe tener al menos 6 caracteres");
    setPass({ actual: "", nueva: "", confirmar: "" });
    toast.success("Contraseña actualizada");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personaliza tu cuenta y preferencias del sistema
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Perfil */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary" />
            <h2 className="font-display text-sm font-bold uppercase tracking-widest">Perfil</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Nombre</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Correo</label>
              <input
                value={user?.email ?? ""}
                disabled
                className="mt-1 w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Rol</label>
              <input
                value={user?.roleLabel ?? ""}
                disabled
                className="mt-1 w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
              />
            </div>
            <button
              onClick={guardarPerfil}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Save size={14} /> Guardar perfil
            </button>
          </div>
        </section>

        {/* Apariencia + Idioma */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-primary" />
            <h2 className="font-display text-sm font-bold uppercase tracking-widest">Apariencia e idioma</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Tema</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                    theme === "light" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                  }`}
                >
                  <Sun size={16} /> Claro
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                    theme === "dark" ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                  }`}
                >
                  <Moon size={16} /> Oscuro
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Idioma</label>
              <select
                value={idioma}
                onChange={(e) => {
                  setIdioma(e.target.value);
                  toast.success("Idioma actualizado");
                }}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notificaciones */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h2 className="font-display text-sm font-bold uppercase tracking-widest">Notificaciones</h2>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: "Notificaciones por correo", state: notifEmail, set: setNotifEmail },
              { label: "Notificaciones push en navegador", state: notifPush, set: setNotifPush },
              { label: "Alertas de conflictos en programación", state: notifConflictos, set: setNotifConflictos },
            ].map((opt) => (
              <label key={opt.label} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/40">
                <span className="text-sm">{opt.label}</span>
                <button
                  type="button"
                  onClick={() => opt.set(!opt.state)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${opt.state ? "bg-primary" : "bg-muted-foreground/30"}`}
                  aria-pressed={opt.state}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-card shadow transition-all ${opt.state ? "left-[18px]" : "left-0.5"}`} />
                </button>
              </label>
            ))}
            <button
              onClick={guardarNotifs}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Save size={14} /> Guardar preferencias
            </button>
          </div>
        </section>

        {/* Seguridad */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-primary" />
            <h2 className="font-display text-sm font-bold uppercase tracking-widest">Seguridad</h2>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Contraseña actual</label>
              <input
                type="password"
                value={pass.actual}
                onChange={(e) => setPass({ ...pass, actual: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nueva contraseña</label>
                <input
                  type="password"
                  value={pass.nueva}
                  onChange={(e) => setPass({ ...pass, nueva: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Confirmar</label>
                <input
                  type="password"
                  value={pass.confirmar}
                  onChange={(e) => setPass({ ...pass, confirmar: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <button
              onClick={guardarPass}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Save size={14} /> Cambiar contraseña
            </button>

            <div className="mt-3 border-t border-border pt-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-card px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <LogOut size={14} /> Cerrar sesión
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
