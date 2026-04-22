import { Clock, CalendarDays, Users, ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const dias = ["lunes", "martes", "miercoles", "jueves", "viernes"];
const horas = ["6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am"];

type Clase = { nombre: string; hora: string; color: string };
const horario: Record<string, Clase[]> = {
  martes: [{ nombre: "Base de Datos", hora: "7:00 - 8:00", color: "bg-primary" }],
  jueves: [{ nombre: "Inteligencia Artificial", hora: "9:00 - 10:00", color: "bg-[hsl(270,60%,50%)]" }],
};

export default function DocenteDashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold">Resumen semanal</h3>
            <Clock size={20} className="text-primary" />
          </div>
          <p className="text-[11px] text-muted-foreground">23 – 27 febrero 2026</p>
          <p className="mt-4 text-3xl font-extrabold">18 horas</p>
          <p className="text-xs text-muted-foreground">Horas programadas</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-sm font-semibold">Próxima clase</h3>
          <div className="mt-3 flex items-center gap-2">
            <CalendarDays size={16} className="text-primary" />
            <span className="text-sm font-bold">Base de Datos</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">7:00 – 8:00 am</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} className="text-destructive" />
            Aula sala computo 1
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
          <h3 className="font-display text-sm font-semibold">Grupos asignado</h3>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-3xl font-extrabold">3</span>
            <Users size={24} className="text-primary" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Activo 2026-1</p>
          <div className="my-3 h-px bg-border" />
          <button
            onClick={() => navigate("/mi-horario")}
            className="rounded-full bg-primary/90 px-6 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary"
          >
            ver todos
          </button>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Mi Horario</h2>
          <span className="text-xs text-primary">23 -27 Febrero 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="pb-3 pr-4 text-left text-xs font-bold uppercase text-muted-foreground w-20" />
                {dias.map((d) => (
                  <th
                    key={d}
                    className={`pb-3 text-center text-xs font-bold uppercase ${
                      d === "jueves" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((h) => (
                <tr key={h} className="border-t border-border">
                  <td className="py-4 pr-4 text-xs text-muted-foreground whitespace-nowrap">{h}</td>
                  {dias.map((d) => {
                    const clases = horario[d]?.filter((c) => c.hora.startsWith(h.replace(" am", ":00").replace(" pm", ":00")));
                    const clase = clases?.[0];
                    return (
                      <td key={d} className="py-4 px-1">
                        {clase ? (
                          <div className={`rounded-xl ${clase.color} px-3 py-2 text-white flex items-center justify-between`}>
                            <div>
                              <p className="text-xs font-bold">{clase.nombre}</p>
                              <p className="text-[10px] opacity-80">{clase.hora}</p>
                            </div>
                            <ArrowRight size={14} className="opacity-70" />
                          </div>
                        ) : (
                          <div className="h-10" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => navigate("/mi-horario")}
            className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/80"
          >
            ver horario completo <ArrowRight size={14} className="text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
