import { GraduationCap, Users, Building2, AlertTriangle, Plus, Check } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "@/contexts/AppStateContext";

const semesterData = [
  { sem: "1°", programa: "Ing. Sistemas", materias: "8/8", progreso: 100, estado: "Completado", color: "text-success" },
  { sem: "3°", programa: "Ing. Sistemas", materias: "6/8", progreso: 75, estado: "En Curso", color: "text-warning" },
  { sem: "5°", programa: "Ing. Industrial", materias: "4/9", progreso: 44, estado: "Pendiente", color: "text-destructive" },
  { sem: "7°", programa: "Ing. Industrial", materias: "7/8", progreso: 87, estado: "Casi Listo", color: "text-success" },
  { sem: "9°", programa: "Ing. Sistemas", materias: "2/7", progreso: 28, estado: "Crítico", color: "text-destructive" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { conflicts, validAssignments } = useAppState();
  const conflictsCount = conflicts.length;
  const globalSummary = [
    { label: "Ing. Sistemas programado", value: "80% completo", dot: "bg-primary" },
    { label: "Ing. Industrial programado", value: "65% completo", dot: "bg-warning" },
    { label: "Docentes con carga completa", value: "22 / 24", dot: "bg-success" },
    { label: "Conflictos activos", value: conflictsCount === 0 ? "Sin conflictos" : `${conflictsCount} sin resolver`, dot: conflictsCount === 0 ? "bg-success" : "bg-destructive" },
    { label: "Asignaciones válidas", value: `${validAssignments}`, dot: "bg-success" },
    { label: "Salones disponibles hoy", value: "20 / 32", dot: "bg-success" },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
            Vista General del Sistema
          </h1>
        </div>
        <button
          onClick={() => toast.success("Nuevo período creado", { description: "Período II 2026 listo para configurar." })}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          <Plus size={18} /> Nuevo período
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Programas Activos" value={2} icon={<GraduationCap size={20} />} trend="Ing. Sistemas · Ing. Industrial" />
        <StatCard label="Docentes Activos" value={24} icon={<Users size={20} />} variant="primary" trend="22 Con carga Asignada" />
        <StatCard label="Asignaturas Programadas" value={48} icon={<Building2 size={20} />} variant="accent" trend="De 60 totales (80%)" />
        <StatCard label="Conflictos Detectados" value={conflictsCount} icon={<AlertTriangle size={20} />} variant="warning" trend={conflictsCount > 0 ? "Requieren Atención" : "Sin conflictos"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Programming state by semester */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Estado de Programación por Semestre
            </h2>
            <span className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1 text-[10px] text-muted-foreground">
              🔒 Solo lectura — operado por secretaría
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th className="pb-3">Semestre</th>
                <th className="pb-3">Programa</th>
                <th className="pb-3">Materias</th>
                <th className="pb-3">Progreso</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {semesterData.map((s, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="py-3 font-semibold">{s.sem} Semestre</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      s.programa.includes("Sistemas") ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                    }`}>
                      {s.programa}
                    </span>
                  </td>
                  <td className="py-3 font-bold">{s.materias}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-success" style={{ width: `${s.progreso}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{s.progreso}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold ${s.color}`}>● {s.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conflict alerts */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Alerta de Conflictos
              </h2>
              <span className="text-[10px] text-muted-foreground">Resolución Secretaría →</span>
            </div>
            <div className="space-y-3">
              {conflicts.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
                  <Check size={22} className="mx-auto text-success" />
                  <p className="mt-1 text-xs font-semibold text-success">Sin conflictos detectados</p>
                </div>
              )}
              {conflicts.map((c) => {
                const isCruce = c.type === "cruce";
                return (
                  <div key={c.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isCruce ? "bg-destructive/10" : "bg-warning/10"}`}>
                          <AlertTriangle size={18} className={isCruce ? "text-destructive" : "text-warning"} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{c.title}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">{c.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/alertas")}
                        className={`shrink-0 rounded-lg px-3 py-1 text-[11px] font-semibold hover:opacity-80 ${isCruce ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}
                      >
                        {isCruce ? "Resolver" : "Reasignar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Global Summary */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Resumen Global
            </h2>
            <div className="space-y-3">
              {globalSummary.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.dot}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${item.dot === "bg-destructive" ? "text-destructive" : "text-muted-foreground"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
