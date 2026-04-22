import {
  GraduationCap,
  Users,
  Building2,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { asignaturasMock, docentesMock, salonesMock, asignacionesMock } from "@/data/mockData";

export default function Dashboard() {
  const totalAsignaciones = asignacionesMock.length;
  const salonesSistemas = asignaturasMock.filter((a) => a.programa === "Ingeniería de Sistemas").length;
  const salonesIndustrial = asignaturasMock.filter((a) => a.programa === "Ingeniería Industrial").length;

  // Simulated conflict count
  const conflictos = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Panel de Control</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen de la programación académica — Período 2025-1
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Asignaturas"
          value={asignaturasMock.length}
          icon={<GraduationCap size={20} />}
          trend={`${salonesSistemas} Sistemas · ${salonesIndustrial} Industrial`}
        />
        <StatCard
          label="Docentes"
          value={docentesMock.length}
          icon={<Users size={20} />}
          variant="primary"
        />
        <StatCard
          label="Salones"
          value={salonesMock.length}
          icon={<Building2 size={20} />}
          variant="accent"
        />
        <StatCard
          label="Asignaciones"
          value={totalAsignaciones}
          icon={<CalendarDays size={20} />}
          variant="warning"
        />
      </div>

      {/* Grid: Alerts + Recent */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alertas */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-semibold">Estado del Sistema</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
              {conflictos > 0 ? (
                <AlertTriangle size={18} className="text-destructive" />
              ) : (
                <CheckCircle2 size={18} className="text-success" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {conflictos > 0 ? `${conflictos} conflictos detectados` : "Sin conflictos detectados"}
                </p>
                <p className="text-xs text-muted-foreground">Cruces de horario y sobrecupo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
              <Clock size={18} className="text-info" />
              <div>
                <p className="text-sm font-medium">{totalAsignaciones} grupos programados</p>
                <p className="text-xs text-muted-foreground">De {asignaturasMock.length} asignaturas registradas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-semibold">Actividad Reciente</h2>
          <div className="mt-4 space-y-3">
            {asignacionesMock.slice(0, 4).map((a) => {
              const asig = asignaturasMock.find((x) => x.id === a.asignaturaId);
              const doc = docentesMock.find((x) => x.id === a.docenteId);
              const salon = salonesMock.find((x) => x.id === a.salonId);
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {a.grupo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{asig?.nombre}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {doc?.nombre} · {salon?.nombre}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {a.jornada}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Usage chart placeholder */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="font-display text-base font-semibold">Ocupación de Salones</h2>
        <div className="mt-4 space-y-3">
          {salonesMock.map((salon) => {
            const uso = asignacionesMock.filter((a) => a.salonId === salon.id).length;
            const maxSlots = 6; // approx max daily blocks
            const pct = Math.min(100, Math.round((uso / maxSlots) * 100));
            return (
              <div key={salon.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{salon.nombre}</span>
                  <span className="text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
