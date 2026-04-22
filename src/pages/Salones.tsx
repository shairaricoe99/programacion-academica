import { salonesMock, asignacionesMock } from "@/data/mockData";
import { Building2, Users, Monitor, FlaskConical } from "lucide-react";

const tipoIcono = {
  teórico: <Building2 size={18} />,
  sala_computo: <Monitor size={18} />,
  laboratorio: <FlaskConical size={18} />,
};

const tipoLabel = {
  teórico: "Teórico",
  sala_computo: "Sala de Cómputo",
  laboratorio: "Laboratorio",
};

const tipoColor = {
  teórico: "bg-primary/10 text-primary",
  sala_computo: "bg-info/10 text-info",
  laboratorio: "bg-warning/10 text-warning",
};

export default function Salones() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Gestión de Infraestructura</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Salones, salas de cómputo y laboratorios
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {salonesMock.map((s) => {
          const asignaciones = asignacionesMock.filter((a) => a.salonId === s.id);
          const ocupacion = asignaciones.reduce((acc, a) => acc + a.horarios.length, 0);

          return (
            <div key={s.id} className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold">{s.nombre}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.edificio}</p>
                </div>
                <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tipoColor[s.tipo]}`}>
                  {tipoIcono[s.tipo]}
                  {tipoLabel[s.tipo]}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Users size={15} className="text-muted-foreground" />
                  <span className="font-semibold">{s.capacidad}</span>
                  <span className="text-xs text-muted-foreground">plazas</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="text-sm">
                  <span className="font-semibold">{ocupacion}</span>
                  <span className="text-xs text-muted-foreground ml-1">bloques asignados</span>
                </div>
              </div>

              {/* Mini usage bar */}
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, Math.round((ocupacion / 12) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
