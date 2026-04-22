import { useState } from "react";
import { asignacionesMock, asignaturasMock, docentesMock, salonesMock, DIAS } from "@/data/mockData";

const BLOQUES = [
  "06:30-08:00", "08:00-09:30", "09:30-11:00", "11:00-12:30",
  "14:00-15:30", "15:30-17:00",
  "18:00-19:30", "19:30-21:00", "21:00-22:30",
];

const colores = [
  "bg-primary/15 text-primary border-primary/30",
  "bg-accent/15 text-accent border-accent/30",
  "bg-warning/15 text-warning border-warning/30",
  "bg-info/15 text-info border-info/30",
  "bg-destructive/15 text-destructive border-destructive/30",
  "bg-success/15 text-success border-success/30",
];

export default function Programacion() {
  const [vista, setVista] = useState<"programa" | "docente" | "salon">("programa");

  const getColor = (id: string) => {
    const idx = parseInt(id, 10) % colores.length;
    return colores[idx];
  };

  const getCellContent = (dia: string, bloque: string) => {
    const [bInicio, bFin] = bloque.split("-");
    return asignacionesMock.filter((a) =>
      a.horarios.some((h) => h.dia === dia && h.bloque.inicio === bInicio && h.bloque.fin === bFin)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Programación Académica</h1>
          <p className="mt-1 text-sm text-muted-foreground">Vista general de horarios</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["programa", "docente", "salon"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                vista === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "programa" ? "Por Programa" : v === "docente" ? "Por Docente" : "Por Salón"}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full min-w-[800px] text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="sticky left-0 z-10 bg-muted/50 px-3 py-2.5 text-left font-semibold w-24">Hora</th>
              {DIAS.map((d) => (
                <th key={d} className="px-2 py-2.5 text-center font-semibold">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BLOQUES.map((bloque) => (
              <tr key={bloque} className="border-b border-border last:border-0">
                <td className="sticky left-0 z-10 bg-card px-3 py-2 font-mono text-[11px] font-medium text-muted-foreground whitespace-nowrap">
                  {bloque}
                </td>
                {DIAS.map((dia) => {
                  const items = getCellContent(dia, bloque);
                  return (
                    <td key={dia} className="px-1 py-1">
                      {items.map((item) => {
                        const asig = asignaturasMock.find((a) => a.id === item.asignaturaId);
                        const doc = docentesMock.find((d) => d.id === item.docenteId);
                        const salon = salonesMock.find((s) => s.id === item.salonId);
                        return (
                          <div
                            key={item.id}
                            className={`rounded-md border px-2 py-1.5 ${getColor(item.asignaturaId)}`}
                          >
                            <p className="font-semibold truncate">{asig?.nombre}</p>
                            <p className="truncate opacity-75">{doc?.nombre}</p>
                            <p className="truncate opacity-60">{salon?.nombre} · G{item.grupo}</p>
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
