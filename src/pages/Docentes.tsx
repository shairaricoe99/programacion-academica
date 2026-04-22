import { docentesMock } from "@/data/mockData";
import { Mail, Phone, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function Docentes() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Docente y Disponibilidad</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestión de carga académica y disponibilidad horaria
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {docentesMock.map((d) => {
          const isOpen = expanded === d.id;
          return (
            <div
              key={d.id}
              className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold">{d.nombre}</h3>
                  <p className="mt-0.5 text-xs font-medium text-primary">{d.especialidad}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {d.nombre.split(" ").map((n) => n[0]).join("")}
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail size={13} />
                  {d.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} />
                  {d.telefono}
                </div>
              </div>

              <button
                onClick={() => setExpanded(isOpen ? null : d.id)}
                className="mt-3 flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted"
              >
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  Disponibilidad ({d.disponibilidad.length} días)
                </span>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {isOpen && (
                <div className="mt-2 space-y-1.5">
                  {d.disponibilidad.map((disp) => (
                    <div key={disp.dia} className="flex items-center gap-2 rounded-md bg-muted/30 px-3 py-1.5 text-xs">
                      <span className="w-20 font-medium">{disp.dia}</span>
                      <span className="text-muted-foreground">
                        {disp.bloques.map((b) => `${b.inicio}–${b.fin}`).join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
