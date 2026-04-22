import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { AlertTriangle, Building2, Bell, CheckCircle2 } from "lucide-react";

export type ConflictItem = {
  id: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
  type: "cruce" | "sobrecupo";
  time: string;
};

export type NotifItem = {
  id: string;
  titulo: string;
  desc: string;
  hora: string;
  tipo: "conflicto" | "info" | "exito" | "alerta";
  leida: boolean;
  rol: ("admin" | "secretaria" | "docente")[];
};

const initialConflicts: ConflictItem[] = [
  {
    id: "c1",
    title: "Cruce de horario - Ing. Raúl Pérez",
    desc: "Asignado simultáneamente a Grupo A01 (Cálculo — Martes 9am) y Grupo B02 (Álgebra — Martes 9am).",
    tag: "Cruce Docente",
    tagColor: "bg-destructive/10 text-destructive",
    type: "cruce",
    time: "Detectado hoy - 8:15 AM",
  },
  {
    id: "c2",
    title: "Sobrecupo - Aula 201",
    desc: "Grupo C03 (Prog. Web) tiene 40 estudiantes. Aula 201 capacidad máxima: 35.",
    tag: "Sobre Cupo",
    tagColor: "bg-warning/10 text-warning",
    type: "sobrecupo",
    time: "Detectado ayer - 4:30 PM",
  },
];

const initialNotifs: NotifItem[] = [
  { id: "n1", titulo: "Cruce de horario detectado", desc: "Dr. R. Pérez asignado a 2 grupos el martes 9am.", hora: "Hace 5 min", tipo: "conflicto", leida: false, rol: ["admin", "secretaria"] },
  { id: "n2", titulo: "Sobrecupo en Aula 201", desc: "40 estudiantes asignados (capacidad 35).", hora: "Hace 1 h", tipo: "alerta", leida: false, rol: ["admin", "secretaria"] },
  { id: "n3", titulo: "Nueva programación publicada", desc: "Período I 2026 disponible para revisión.", hora: "Hace 3 h", tipo: "info", leida: true, rol: ["admin", "secretaria", "docente"] },
  { id: "n4", titulo: "Tu horario fue actualizado", desc: "Cambio en Base de Datos · Aula 201 → Sala C2.", hora: "Ayer", tipo: "info", leida: false, rol: ["docente"] },
  { id: "n5", titulo: "Disponibilidad guardada", desc: "Tu disponibilidad semanal fue registrada.", hora: "Ayer", tipo: "exito", leida: true, rol: ["docente"] },
  { id: "n6", titulo: "Conflicto resuelto", desc: "Sobrecupo en Aula 304 marcado como resuelto.", hora: "2 días", tipo: "exito", leida: true, rol: ["admin", "secretaria"] },
];

type ResolvedItem = {
  id: string;
  fecha: string;
  tipo: string;
  desc: string;
  resuelto: string;
};

interface AppStateValue {
  conflicts: ConflictItem[];
  resolvedHistory: ResolvedItem[];
  notifs: NotifItem[];
  resolveConflict: (id: string, resolvedBy?: string) => void;
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
  deleteNotif: (id: string) => void;
  clearNotifs: () => void;
  validAssignments: number;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [conflicts, setConflicts] = useState<ConflictItem[]>(initialConflicts);
  const [resolvedHistory, setResolvedHistory] = useState<ResolvedItem[]>([
    { id: "h1", fecha: "18 Feb 2026", tipo: "Cruce Docente", desc: "Ing. Torres - Grupos D01 y D02 - Lunes 2pm", resuelto: "M. Acosta" },
    { id: "h2", fecha: "15 Feb 2026", tipo: "Sobre Cupo", desc: "Aula 304 - Grupo E01 (38 est.) - cap. max. 35", resuelto: "M. Acosta" },
    { id: "h3", fecha: "10 Feb 2026", tipo: "Disponibilidad", desc: "Dr. Ramírez asignado fuera de su disponibilidad", resuelto: "M. Acosta" },
  ]);
  const [notifs, setNotifs] = useState<NotifItem[]>(initialNotifs);
  const [validAssignments, setValidAssignments] = useState(18);

  const resolveConflict = (id: string, resolvedBy = "M. Acosta") => {
    const c = conflicts.find((x) => x.id === id);
    if (!c) return;
    setConflicts((prev) => prev.filter((x) => x.id !== id));
    setValidAssignments((n) => n + 1);
    setResolvedHistory((prev) => [
      {
        id: `h-${Date.now()}`,
        fecha: new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
        tipo: c.tag,
        desc: c.desc,
        resuelto: resolvedBy,
      },
      ...prev,
    ]);
    // Add success notification
    setNotifs((prev) => [
      {
        id: `n-${Date.now()}`,
        titulo: "Conflicto resuelto",
        desc: c.title,
        hora: "Ahora",
        tipo: "exito",
        leida: false,
        rol: ["admin", "secretaria"],
      },
      ...prev,
    ]);
  };

  const markNotifRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
  const markAllNotifsRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, leida: true })));
  const deleteNotif = (id: string) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  const clearNotifs = () => setNotifs([]);

  const value = useMemo(
    () => ({
      conflicts,
      resolvedHistory,
      notifs,
      resolveConflict,
      markNotifRead,
      markAllNotifsRead,
      deleteNotif,
      clearNotifs,
      validAssignments,
    }),
    [conflicts, resolvedHistory, notifs, validAssignments]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

// Icon helpers
export const notifIconMap = {
  conflicto: { icon: AlertTriangle, bg: "bg-destructive/10", color: "text-destructive" },
  alerta: { icon: Building2, bg: "bg-warning/10", color: "text-warning" },
  info: { icon: Bell, bg: "bg-info/10", color: "text-info" },
  exito: { icon: CheckCircle2, bg: "bg-success/10", color: "text-success" },
};
