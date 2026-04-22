import { Users, FileText, Building2, AlertTriangle, Plus, ArrowRight, Check } from "lucide-react";
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

const spaces = [
  { name: "201", type: "Aula Teórica", cap: 35, actual: 40, estado: "Conflicto", color: "text-destructive" },
  { name: "304", type: "Aula Teórica", cap: 40, actual: 32, estado: "Asignada", color: "text-warning" },
  { name: "Lab - 01", type: "Laboratorio", cap: 25, actual: null, estado: "Disponible", color: "text-success" },
  { name: "Sala - C2", type: "Sala Cómputo", cap: 30, actual: 28, estado: "Ocupada", color: "text-destructive" },
  { name: "410", type: "Aula Teórica", cap: 45, actual: null, estado: "Disponible", color: "text-success" },
  { name: "Lab - 02", type: "Laboratorio", cap: 20, actual: 18, estado: "Asignada", color: "text-warning" },
];

const cargaDocente = [
  { nombre: "Ing. Ramírez", materia: "Web Avanzada", horas: "16h", estado: "OK", color: "text-success" },
  { nombre: "Ing. R. Pérez", materia: "Cálculo Diferencial", horas: "8h", estado: "Baja", color: "text-info" },
  { nombre: "Ing. Torres", materia: "Base de Datos", horas: "15h", estado: "OK", color: "text-success" },
  { nombre: "Ing. Vargas", materia: "Prog. Web", horas: "20h", estado: "Exceso", color: "text-destructive" },
  { nombre: "Ing. López", materia: "Estadística", horas: "12h", estado: "Normal", color: "text-warning" },
];

export default function SecretariaDashboard() {
  const navigate = useNavigate();
  const { conflicts } = useAppState();
  const conflictsCount = conflicts.length;
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-lg text-muted-foreground">
            Estado general de la programación académica · Período I 2026
          </h1>
        </div>
        <button
          onClick={() => {
            toast.success("Abriendo editor de programación");
            navigate("/programacion");
          }}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          <Plus size={18} /> Nueva programación
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Docentes Activos" value={24} icon={<Users size={20} />} trend="↑ 2 nuevos" />
        <StatCard label="Asignaturas Programadas" value={48} icon={<FileText size={20} />} variant="primary" trend="12 Pendientes" />
        <StatCard label="Espacios Disponibles" value={32} icon={<Building2 size={20} />} variant="accent" trend="86% Ocupación" />
        <StatCard label="Conflictos Activos" value={conflictsCount} icon={<AlertTriangle size={20} />} variant="warning" trend={conflictsCount > 0 ? "Requieren Atención" : "Sin conflictos"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Programming state */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Estado de Programación por Semestre
            </h2>
            <button
              onClick={() => navigate("/programacion")}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Ver Todo <ArrowRight size={12} />
            </button>
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
                <tr key={i}>
                  <td className="py-3 font-semibold">{s.sem} Semestre</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      s.programa.includes("Sistemas") ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                    }`}>{s.programa}</span>
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
          {/* Conflicts */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">Conflictos Detectados</h2>
              <button
                onClick={() => navigate("/conflictos")}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Ver Todo <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-3">
              {conflicts.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-center">
                  <Check size={20} className="mx-auto text-success" />
                  <p className="mt-1 text-xs font-semibold text-success">Sin conflictos activos</p>
                </div>
              )}
              {conflicts.map((c) => {
                const isCruce = c.type === "cruce";
                return (
                  <div key={c.id} className="rounded-xl border border-border p-3 flex items-start gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isCruce ? "bg-destructive/10" : "bg-warning/10"}`}>
                      {isCruce ? (
                        <AlertTriangle size={16} className="text-destructive" />
                      ) : (
                        <Building2 size={16} className="text-warning" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold">{c.title}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{c.desc}</p>
                    </div>
                    <button
                      onClick={() => navigate("/conflictos")}
                      className={`rounded-lg px-2.5 py-1 text-[10px] font-bold hover:opacity-80 ${isCruce ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}
                    >
                      {isCruce ? "Resolver" : "Reasignar"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ocupación de Espacio (Hoy) */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Ocupación de Espacio (Hoy)
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {spaces.map((s, i) => (
              <div key={i} className="rounded-xl border border-border p-3">
                <p className="text-lg font-bold">{s.name}</p>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">{s.type}</p>
                <p className="text-[10px] text-muted-foreground">Cap. {s.cap}{s.actual ? ` · Actual ${s.actual}` : " · Libre"}</p>
                <p className={`mt-1 text-[10px] font-bold ${s.color}`}>● {s.estado}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Carga Docente Semanal */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Carga Docente Semanal
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th className="pb-3">Docente</th>
                <th className="pb-3">Carga</th>
                <th className="pb-3">Horas</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cargaDocente.map((d, i) => (
                <tr key={i}>
                  <td className="py-2.5">
                    <p className="font-medium text-sm">{d.nombre}</p>
                    <p className="text-[10px] text-muted-foreground">{d.materia}</p>
                  </td>
                  <td className="py-2.5">
                    {d.estado === "Exceso" && <div className="h-1.5 w-12 rounded-full bg-destructive" />}
                  </td>
                  <td className="py-2.5 font-bold">{d.horas}</td>
                  <td className="py-2.5">
                    <span className={`text-xs font-semibold ${d.color}`}>● {d.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
