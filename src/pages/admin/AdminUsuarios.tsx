import { Shield, FileText, Users, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const roles = [
  {
    name: "Administrador",
    desc: "Panel administrativo: estado de programación, alertas de conflictos, estadísticas de salones y gestión de usuarios.",
    count: 1,
    icon: <Shield size={24} className="text-destructive" />,
    bg: "bg-destructive/10",
  },
  {
    name: "Secretaría Académica",
    desc: "Gestiona la programación: asigna docentes, horarios, salones. Resuelve conflictos y genera reportes por docente, grupo y salón.",
    count: 2,
    icon: <FileText size={24} className="text-info" />,
    bg: "bg-info/10",
  },
  {
    name: "Docente",
    desc: "Solo lectura de su horario asignado. Registra su disponibilidad horaria. No accede a datos de otros docentes.",
    count: 15,
    icon: <Users size={24} className="text-warning" />,
    bg: "bg-warning/10",
  },
];

const users = [
  { name: "Shaira Rico", email: "Shaira.Rico@unilibre.edu.co", rol: "Administrador", acceso: "Ahora", estado: "Activo" },
  { name: "María Acosta", email: "m.acosta@unilibre.edu.co", rol: "Secretaría", acceso: "Hace 20 min", estado: "Activo" },
  { name: "Raúl Pérez", email: "r.perez@unilibre.edu.co", rol: "Docente", acceso: "Hace 1h", estado: "Activo" },
  { name: "Jorge Gutiérrez", email: "j.gutierrez@unilibre.edu.co", rol: "Docente", acceso: "Hace 3 Días", estado: "Inactivo" },
];

export default function AdminUsuarios() {
  const [tab, setTab] = useState("todos");
  const [usersList, setUsersList] = useState(users);

  const filteredUsers = tab === "todos" ? usersList : usersList.filter(u =>
    tab === "admin" ? u.rol === "Administrador" :
    tab === "secretaria" ? u.rol === "Secretaría" :
    u.rol === "Docente"
  );

  const toggleEstado = (idx: number) => {
    setUsersList((prev) => prev.map((u, i) =>
      i === idx ? { ...u, estado: u.estado === "Activo" ? "Inactivo" : "Activo" } : u
    ));
    toast.success(`Usuario ${usersList[idx].estado === "Activo" ? "bloqueado" : "activado"}`);
  };

  const editar = (name: string) => toast(`Editando usuario: ${name}`);
  const crear = () => toast.success("Formulario de creación de usuario abierto");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
            Usuarios y Roles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Autenticación JWT · Roles: Administrador / Secretaría Académica / Docente
          </p>
        </div>
        <button
          onClick={crear}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          <Plus size={18} /> Crear Usuario
        </button>
      </div>

      {/* Role cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map((r, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${r.bg}`}>
              {r.icon}
            </div>
            <h3 className="mt-3 font-display text-sm font-bold uppercase">{r.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
            <p className="mt-3 text-sm font-bold text-primary">{r.count} Usuario{r.count !== 1 ? "s" : ""}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1 w-fit">
        {[
          { key: "todos", label: `Todos (${users.length})` },
          { key: "admin", label: "Administrador(1)" },
          { key: "secretaria", label: "Secretaría (2)" },
          { key: "docentes", label: `Docentes (${users.filter(u => u.rol === "Docente").length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              tab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Listado de Docentes
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="pb-3">Docente</th>
              <th className="pb-3">Correo</th>
              <th className="pb-3">Rol</th>
              <th className="pb-3">Último Acceso</th>
              <th className="pb-3">Estado</th>
              <th className="pb-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((u, i) => (
              <tr key={i}>
                <td className="py-3 font-medium">{u.name}</td>
                <td className="py-3 text-muted-foreground">{u.email}</td>
                <td className="py-3">{u.rol}</td>
                <td className="py-3 text-muted-foreground">{u.acceso}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    u.estado === "Activo" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                  }`}>
                    ● {u.estado}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => editar(u.name)}
                      className="rounded px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-muted"
                    >
                      Editar
                    </button>
                    {u.estado === "Activo" ? (
                      <button
                        onClick={() => toggleEstado(usersList.indexOf(u))}
                        className="rounded bg-warning/10 px-2 py-1 text-[10px] font-medium text-warning hover:bg-warning/20"
                      >
                        Bloquear
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleEstado(usersList.indexOf(u))}
                        className="rounded bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20"
                      >
                        Activar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
