import { Building2, Monitor, FlaskConical } from "lucide-react";

const spaceStats = [
  { icon: <Building2 size={24} className="text-success" />, value: 18, label: "Aulas Teóricas", sub: "88% ocupación promedio", subColor: "text-primary" },
  { icon: <Monitor size={24} className="text-info" />, value: 6, label: "Sala Cómputo", sub: "72% ocupación promedio", subColor: "text-info" },
  { icon: <FlaskConical size={24} className="text-destructive" />, value: 8, label: "Laboratorios", sub: "60% ocupación promedio", subColor: "text-warning" },
];

const occupancy = [
  { espacio: "Aula 201", pct: "114%", estado: "Sobrecupo", color: "text-destructive" },
  { espacio: "Aula 304", pct: "80%", estado: "Alto", color: "text-warning" },
  { espacio: "Aula 410", pct: "40%", estado: "Libre", color: "text-success" },
  { espacio: "Sala Cómputo 1", pct: "93%", estado: "Casi lleno", color: "text-destructive" },
  { espacio: "Sala Cómputo 2", pct: "60%", estado: "Moderado", color: "text-warning" },
  { espacio: "Laboratorio 01", pct: "25%", estado: "Libre", color: "text-success" },
  { espacio: "Laboratorio 02", pct: "72%", estado: "Moderado", color: "text-warning" },
];

const jornada = [
  { label: "Jornada Diurna", pct: "95%", estado: "Muy alto", color: "text-destructive" },
  { label: "Jornada Nocturna", pct: "55%", estado: "Moderado", color: "text-warning" },
];

const disponibilidad = [
  { label: "Aulas teóricas libres", value: "6 de 18" },
  { label: "Salas cómputo libres", value: "2 de 6" },
  { label: "Laboratorios libres", value: "5 de 8" },
  { label: "Espacios con conflicto", value: "1 (Aula 201)" },
];

export default function AdminEstadisticas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
          Estadísticas de Uso de Salones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ocupación de aulas teóricas, salas de cómputo y laboratorios · Período I 2026
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {spaceStats.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            {s.icon}
            <p className="mt-2 text-3xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`mt-1 text-[11px] font-medium ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Occupancy by space */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Ocupación por Espacio — Hoy
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="pb-3">Espacio</th>
                <th className="pb-3">Hoy</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {occupancy.map((o, i) => (
                <tr key={i}>
                  <td className="py-3 font-medium">{o.espacio}</td>
                  <td className={`py-3 font-bold ${o.color}`}>{o.pct}</td>
                  <td className="py-3">
                    <span className={`rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold ${o.color}`}>
                      ● {o.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Ocupación por jornada */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Ocupación por Jornada
            </h2>
            <div className="space-y-4">
              {jornada.map((j, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{j.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{j.pct}</span>
                    <span className={`rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold ${j.color}`}>
                      ● {j.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disponibilidad actual */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Disponibilidad Actual
            </h2>
            <div className="space-y-3">
              {disponibilidad.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{d.label}</span>
                  <span className="font-medium text-muted-foreground">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
