import { AlertTriangle, Users, Building2, Lock, Check } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";

export default function AdminAlertas() {
  const { conflicts, resolvedHistory, validAssignments } = useAppState();
  const cruceCount = conflicts.filter((c) => c.type === "cruce").length;
  const sobrecupoCount = conflicts.filter((c) => c.type === "sobrecupo").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
          Alertas de Conflictos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conflictos detectados automáticamente por el sistema · La resolución la gestiona Secretaría Académica
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Users size={24} className="text-destructive" />
          <p className="mt-2 text-3xl font-bold text-destructive">{cruceCount}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cruce de Docente</p>
          <p className="mt-1 text-[11px] text-primary">Mismo horario, 2 grupos</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Building2 size={24} className="text-warning" />
          <p className="mt-2 text-3xl font-bold text-warning">{sobrecupoCount}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sobrecupo de Salón</p>
          <p className="mt-1 text-[11px] text-primary">Grupo excede Capacidad</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <Check size={24} className="text-success" />
          <p className="mt-2 text-3xl font-bold text-success">{validAssignments}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Asignaciones Válidas</p>
          <p className="mt-1 text-[11px] text-success">Esta semana sin conflicto</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Conflictos Activos — Período I 2026
        </h2>
        <div className="space-y-4">
          {conflicts.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <Check size={28} className="mx-auto text-success" />
              <p className="mt-2 text-sm font-semibold text-success">¡Sin conflictos activos!</p>
            </div>
          )}
          {conflicts.map((c) => {
            const Icon = c.type === "cruce" ? Users : Building2;
            const iconColor = c.type === "cruce" ? "text-destructive" : "text-warning";
            const iconBg = c.type === "cruce" ? "bg-destructive/10" : "bg-warning/10";
            return (
              <div key={c.id} className="flex items-start gap-4 rounded-xl border border-border p-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{c.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`inline-block rounded-lg px-3 py-1 text-[11px] font-semibold ${c.tagColor}`}>
                    {c.tag}
                  </span>
                  <p className="mt-1 text-[10px] text-muted-foreground">{c.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
          <Lock size={16} className="text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            La resolución de estos conflictos corresponde a <span className="font-bold text-primary">Secretaría Académica</span>. Esta vista es de solo lectura para el Administrador.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Historial de Conflictos Resueltos
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="pb-3">Fecha</th>
              <th className="pb-3">Tipo</th>
              <th className="pb-3">Descripción</th>
              <th className="pb-3">Resuelto Por</th>
              <th className="pb-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {resolvedHistory.map((h) => (
              <tr key={h.id}>
                <td className="py-3 text-muted-foreground">{h.fecha}</td>
                <td className="py-3 font-medium">{h.tipo}</td>
                <td className="py-3 text-muted-foreground">{h.desc}</td>
                <td className="py-3">{h.resuelto}</td>
                <td className="py-3"><span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-bold text-success">● Resuelto</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
