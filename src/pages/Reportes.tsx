import { useState } from "react";
import { Users, Building2, BarChart3, AlertTriangle, FileText, ArrowRight, Download, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { docentesMock, asignaturasMock, salonesMock, asignacionesMock } from "@/data/mockData";
import { useAppState } from "@/contexts/AppStateContext";

type ReportKey =
  | "horarioDocente"
  | "horarioGrupo"
  | "horarioSalon"
  | "programacionGeneral"
  | "conflictos"
  | "estadistica";

interface ReportCard {
  key: ReportKey;
  title: string;
  desc: string;
  icon: JSX.Element;
  iconBg: string;
  iconColor: string;
}

const reportCards: ReportCard[] = [
  { key: "horarioDocente", title: "Horario por Docente", desc: "Consulta todas las clases y horarios asignados a un docente específico", icon: <Users size={28} />, iconBg: "bg-destructive/10", iconColor: "text-destructive" },
  { key: "horarioGrupo", title: "Horario por Grupo", desc: "Visualiza el horario completo de un grupo específico con docentes y salones", icon: <Users size={28} />, iconBg: "bg-warning/10", iconColor: "text-warning" },
  { key: "horarioSalon", title: "Horario por Salón", desc: "Revisa la ocupación de cada aula, laboratorio o sala de cómputo", icon: <Building2 size={28} />, iconBg: "bg-success/10", iconColor: "text-success" },
  { key: "programacionGeneral", title: "Programación General", desc: "Vista completa de toda la programación por programa académico y semestre", icon: <BarChart3 size={28} />, iconBg: "bg-info/10", iconColor: "text-info" },
  { key: "conflictos", title: "Reporte Conflictos", desc: "Listado de todos los conflictos detectados: cruces, sobrecupo y disponibilidad", icon: <AlertTriangle size={28} />, iconBg: "bg-[hsl(270,60%,95%)]", iconColor: "text-[hsl(270,60%,50%)]" },
  { key: "estadistica", title: "Estadística de Uso", desc: "Análisis de ocupación de salones y distribución de carga docente", icon: <FileText size={28} />, iconBg: "bg-destructive/10", iconColor: "text-destructive" },
];

export default function Reportes() {
  const [active, setActive] = useState<ReportCard | null>(null);
  const { conflicts, resolvedHistory } = useAppState();

  const descargar = (titulo: string) => {
    toast.success(`Descargando "${titulo}.pdf"`, { description: "El archivo estará listo en breve." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Consultas y Reportes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Horarios por docente, grupo, salón y programación general.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reportCards.map((card) => (
          <div key={card.key} className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elevated transition-shadow">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg}`}>
              <span className={card.iconColor}>{card.icon}</span>
            </div>
            <h3 className="mt-4 font-display text-sm font-bold uppercase">{card.title}</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setActive(card)}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Ver Reporte <ArrowRight size={12} />
              </button>
              <button
                onClick={() => descargar(card.title)}
                className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-medium hover:bg-muted"
                title="Descargar PDF"
              >
                <Download size={11} /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display uppercase">{active?.title}</DialogTitle>
            <DialogDescription>{active?.desc}</DialogDescription>
          </DialogHeader>
          {active && (
            <div className="mt-2">
              <ReportContent reportKey={active.key} conflicts={conflicts} resolvedHistory={resolvedHistory} />
              <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
                <button
                  onClick={() => setActive(null)}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  <X size={14} className="inline mr-1" /> Cerrar
                </button>
                <button
                  onClick={() => descargar(active.title)}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Download size={14} className="inline mr-1" /> Descargar PDF
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportContent({
  reportKey,
  conflicts,
  resolvedHistory,
}: {
  reportKey: ReportKey;
  conflicts: ReturnType<typeof useAppState>["conflicts"];
  resolvedHistory: ReturnType<typeof useAppState>["resolvedHistory"];
}) {
  const cellClass = "py-2 px-3 text-xs";
  const headClass = "py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 text-left";

  if (reportKey === "horarioDocente") {
    return (
      <table className="w-full border border-border rounded-lg overflow-hidden">
        <thead><tr><th className={headClass}>Docente</th><th className={headClass}>Especialidad</th><th className={headClass}>Email</th></tr></thead>
        <tbody className="divide-y divide-border">
          {docentesMock.map((d) => (
            <tr key={d.id}><td className={cellClass + " font-semibold"}>{d.nombre}</td><td className={cellClass}>{d.especialidad}</td><td className={cellClass + " text-muted-foreground"}>{d.email}</td></tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (reportKey === "horarioGrupo") {
    return (
      <table className="w-full border border-border rounded-lg overflow-hidden">
        <thead><tr><th className={headClass}>Grupo</th><th className={headClass}>Asignatura</th><th className={headClass}>Jornada</th><th className={headClass}>Horarios</th><th className={headClass}>Estudiantes</th></tr></thead>
        <tbody className="divide-y divide-border">
          {asignacionesMock.map((a) => {
            const asig = asignaturasMock.find((x) => x.id === a.asignaturaId);
            const horariosTxt = a.horarios.map((h) => `${h.dia} ${h.bloque.inicio}-${h.bloque.fin}`).join(", ");
            return (
              <tr key={a.id}>
                <td className={cellClass + " font-bold"}>{a.grupo}</td>
                <td className={cellClass}>{asig?.nombre ?? "-"}</td>
                <td className={cellClass}>{a.jornada}</td>
                <td className={cellClass + " text-muted-foreground"}>{horariosTxt}</td>
                <td className={cellClass}>{a.numEstudiantes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  if (reportKey === "horarioSalon") {
    return (
      <table className="w-full border border-border rounded-lg overflow-hidden">
        <thead><tr><th className={headClass}>Salón</th><th className={headClass}>Tipo</th><th className={headClass}>Capacidad</th><th className={headClass}>Asignaciones</th></tr></thead>
        <tbody className="divide-y divide-border">
          {salonesMock.map((s) => {
            const uso = asignacionesMock.filter((a) => a.salonId === s.id).length;
            return (
              <tr key={s.id}>
                <td className={cellClass + " font-semibold"}>{s.nombre}</td>
                <td className={cellClass}>{s.tipo}</td>
                <td className={cellClass}>{s.capacidad}</td>
                <td className={cellClass + " font-bold text-primary"}>{uso}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  if (reportKey === "programacionGeneral") {
    return (
      <table className="w-full border border-border rounded-lg overflow-hidden">
        <thead><tr><th className={headClass}>Asignatura</th><th className={headClass}>Programa</th><th className={headClass}>Semestre</th></tr></thead>
        <tbody className="divide-y divide-border">
          {asignaturasMock.map((a) => (
            <tr key={a.id}><td className={cellClass + " font-semibold"}>{a.nombre}</td><td className={cellClass}>{a.programa}</td><td className={cellClass}>{a.semestre}</td></tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (reportKey === "conflictos") {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase mb-2 text-muted-foreground">Activos ({conflicts.length})</p>
          {conflicts.length === 0 ? (
            <p className="text-xs text-success">Sin conflictos activos.</p>
          ) : (
            <ul className="space-y-2">
              {conflicts.map((c) => (
                <li key={c.id} className="rounded-lg border border-border p-3">
                  <p className="text-xs font-bold">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground">{c.desc}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-xs font-bold uppercase mb-2 text-muted-foreground">Resueltos ({resolvedHistory.length})</p>
          <ul className="space-y-2">
            {resolvedHistory.map((h) => (
              <li key={h.id} className="rounded-lg border border-border p-3">
                <p className="text-xs font-bold">{h.tipo} · <span className="text-muted-foreground font-normal">{h.fecha}</span></p>
                <p className="text-[11px] text-muted-foreground">{h.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // estadistica
  return (
    <div className="space-y-3">
      {salonesMock.map((salon) => {
        const uso = asignacionesMock.filter((a) => a.salonId === salon.id).length;
        const pct = Math.min(100, Math.round((uso / 6) * 100));
        return (
          <div key={salon.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">{salon.nombre}</span>
              <span className="text-muted-foreground">{pct}% · {uso} bloques</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
