import { Bot, Construction } from "lucide-react";

export default function Asistente() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Bot size={28} className="text-primary" />
      </div>
      <h1 className="mt-4 font-display text-xl font-bold">Asistente Inteligente</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Consultas en lenguaje natural sobre la programación académica. Ejemplo: "¿Qué salones están libres los martes después de las 6:00 PM?"
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-warning/10 px-4 py-2 text-xs font-medium text-warning">
        <Construction size={14} />
        Próximamente
      </div>
    </div>
  );
}
