import { useState } from "react";
import { toast } from "sonner";

const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
const bloques = ["7 - 9 am", "9 - 11 am", "11 - 1 pm", "1 - 3 pm"];

type Status = "libre" | "ocupado" | "parcial";

const initialDisp: Record<string, Record<string, Status>> = {
  Lunes: { "7 - 9 am": "ocupado", "9 - 11 am": "libre", "11 - 1 pm": "libre", "1 - 3 pm": "libre" },
  Martes: { "7 - 9 am": "ocupado", "9 - 11 am": "ocupado", "11 - 1 pm": "libre", "1 - 3 pm": "parcial" },
  Miercoles: { "7 - 9 am": "libre", "9 - 11 am": "libre", "11 - 1 pm": "ocupado", "1 - 3 pm": "libre" },
  Jueves: { "7 - 9 am": "ocupado", "9 - 11 am": "ocupado", "11 - 1 pm": "libre", "1 - 3 pm": "libre" },
  Viernes: { "7 - 9 am": "libre", "9 - 11 am": "parcial", "11 - 1 pm": "libre", "1 - 3 pm": "libre" },
};

const statusColors: Record<Status, string> = {
  ocupado: "border-destructive/40 bg-destructive/5 text-destructive",
  libre: "border-success/40 bg-success/5 text-success",
  parcial: "border-warning/40 bg-warning/5 text-warning",
};

export default function DocenteDisponibilidad() {
  const [disp, setDisp] = useState(initialDisp);

  const toggle = (dia: string, bloque: string) => {
    const order: Status[] = ["libre", "ocupado", "parcial"];
    const current = disp[dia][bloque];
    const next = order[(order.indexOf(current) + 1) % order.length];
    setDisp((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [bloque]: next },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Disponibilidad</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registra tu disponibilidad horaria. Haz clic en un bloque para cambiar su estado.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="grid grid-cols-5 gap-4">
          {dias.map((dia) => (
            <div key={dia}>
              <h3 className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {dia}
              </h3>
              <div className="space-y-2">
                {bloques.map((bloque) => (
                  <button
                    key={bloque}
                    onClick={() => toggle(dia, bloque)}
                    className={`w-full rounded-xl border-2 px-3 py-3 text-xs font-semibold transition-all ${statusColors[disp[dia][bloque]]}`}
                  >
                    {bloque}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 justify-end">
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 rounded border-2 border-destructive/40 bg-destructive/5" />
            <span className="text-xs text-muted-foreground">Ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 rounded border-2 border-success/40 bg-success/5" />
            <span className="text-xs text-muted-foreground">Libre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 rounded border-2 border-warning/40 bg-warning/5" />
            <span className="text-xs text-muted-foreground">Parcial</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setDisp(initialDisp);
            toast("Cambios descartados");
          }}
          className="rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-semibold hover:bg-muted"
        >
          Descartar
        </button>
        <button
          onClick={() =>
            toast.success("Disponibilidad guardada", {
              description: "Tu disponibilidad fue registrada para el período actual.",
            })
          }
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          Guardar Disponibilidad
        </button>
      </div>
    </div>
  );
}
