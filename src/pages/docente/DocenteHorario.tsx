import { ArrowRight } from "lucide-react";

const dias = ["lunes", "martes", "miercoles", "jueves", "viernes"];
const horas = ["6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "1:00", "2:00", "3:00", "6:00 pm", "7:00 pm", "8:00 pm"];

type Clase = { nombre: string; hora: string; salon: string; color: string };
const horarioCompleto: Record<string, Clase[]> = {
  martes: [
    { nombre: "Base de Datos", hora: "7:00 - 9:00", salon: "Aula 201", color: "bg-primary" },
    { nombre: "Estadística", hora: "9:00 - 11:00", salon: "Aula 304", color: "bg-warning" },
  ],
  miercoles: [
    { nombre: "Web Avanzada", hora: "7:00 - 9:00", salon: "Sala C2", color: "bg-success" },
  ],
  jueves: [
    { nombre: "Inteligencia Artificial", hora: "9:00 - 11:00", salon: "Lab 01", color: "bg-[hsl(270,60%,50%)]" },
    { nombre: "Base de Datos", hora: "1:00 - 3:00", salon: "Aula 201", color: "bg-primary" },
  ],
  viernes: [
    { nombre: "Física Mecánica", hora: "7:00 - 9:00", salon: "Lab 01", color: "bg-info" },
  ],
};

export default function DocenteHorario() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Mi Horario</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Horario completo del semestre — Período I 2026
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr>
              <th className="pb-3 text-left text-xs font-bold uppercase text-muted-foreground w-20">Hora</th>
              {dias.map((d) => (
                <th key={d} className="pb-3 text-center text-xs font-bold uppercase text-muted-foreground">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((h) => (
              <tr key={h} className="border-t border-border">
                <td className="py-3 pr-4 text-xs text-muted-foreground whitespace-nowrap">{h}</td>
                {dias.map((d) => {
                  const clase = horarioCompleto[d]?.find((c) => c.hora.startsWith(h.split(" ")[0]));
                  return (
                    <td key={d} className="py-3 px-1">
                      {clase ? (
                        <div className={`rounded-xl ${clase.color} px-3 py-2 text-white`}>
                          <p className="text-xs font-bold">{clase.nombre}</p>
                          <p className="text-[10px] opacity-80">{clase.hora}</p>
                          <p className="text-[10px] opacity-70">{clase.salon}</p>
                        </div>
                      ) : (
                        <div className="h-8" />
                      )}
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
