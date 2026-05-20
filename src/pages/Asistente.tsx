import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, Trash2, Loader2, User, Database } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAppState } from "@/contexts/AppStateContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import aiAvatar from "@/assets/ai-asistente.png";
import {
  asignaturasMock,
  docentesMock,
  salonesMock,
  asignacionesMock,
  BLOQUES_DIURNA,
  BLOQUES_NOCTURNA,
} from "@/data/mockData";

interface Msg {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

const SUGERENCIAS = [
  "¿Qué salones están libres el martes después de las 6 PM?",
  "¿Cuál es la carga académica del profesor Carlos Pérez?",
  "¿Qué grupos tienen conflictos de horario?",
  "Muéstrame los salones ocupados los lunes en la mañana",
  "Lista los docentes disponibles los viernes en la tarde",
];

export default function Asistente() {
  const { user } = useAuth();
  const email = user?.email ?? "anon@unilibre.edu.co";
  const { conflicts, resolvedHistory } = useAppState();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Snapshot vivo del sistema: se recalcula y se envía a la IA en cada petición.
  const snapshot = useMemo(() => {
    const docId = (id: string) => docentesMock.find((d) => d.id === id)?.nombre ?? id;
    const asigId = (id: string) => asignaturasMock.find((a) => a.id === id)?.nombre ?? id;
    const salId = (id: string) => salonesMock.find((s) => s.id === id)?.nombre ?? id;
    return {
      bloques: { diurna: BLOQUES_DIURNA, nocturna: BLOQUES_NOCTURNA },
      asignaturas: asignaturasMock,
      docentes: docentesMock,
      salones: salonesMock,
      asignaciones: asignacionesMock.map((g) => ({
        ...g,
        asignaturaNombre: asigId(g.asignaturaId),
        docenteNombre: docId(g.docenteId),
        salonNombre: salId(g.salonId),
      })),
      conflictos: conflicts.map((c) => ({ titulo: c.title, descripcion: c.desc, tipo: c.type, hora: c.time })),
      conflictosResueltos: resolvedHistory.map((r) => ({ fecha: r.fecha, tipo: r.tipo, desc: r.desc, resuelto: r.resuelto })),
      generadoEn: new Date().toISOString(),
    };
  }, [conflicts, resolvedHistory]);


  // Cargar historial
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, role, content")
        .eq("user_email", email)
        .order("created_at", { ascending: true });
      if (!error && data) setMessages(data as Msg[]);
    })();
  }, [email]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // Focus textarea
  useEffect(() => {
    textareaRef.current?.focus();
  }, [loading]);

  async function send(text: string) {
    const prompt = text.trim();
    if (!prompt || loading) return;

    const userMsg: Msg = { role: "user", content: prompt };
    const optimistic = [...messages, userMsg];
    setMessages(optimistic);
    setInput("");
    setLoading(true);
    setStreaming(false);

    // Guardar mensaje del usuario
    supabase.from("chat_messages").insert({ user_email: email, role: "user", content: prompt }).then();

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: optimistic.map((m) => ({ role: m.role, content: m.content })),
          context: snapshot,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        let errMsg = "Error en el asistente";
        try {
          errMsg = JSON.parse(errText).error || errMsg;
        } catch {}
        toast.error(errMsg);
        setMessages(optimistic);
        return;
      }

      // Parse SSE stream
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      setMessages([...optimistic, { role: "assistant", content: "" }]);
      setStreaming(true);
      setLoading(false);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: assistantText };
                return next;
              });
            }
          } catch {}
        }
      }

      if (assistantText) {
        supabase
          .from("chat_messages")
          .insert({ user_email: email, role: "assistant", content: assistantText })
          .then();
      }
    } catch (e) {
      toast.error("Error de conexión con el asistente");
      setMessages(optimistic);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  async function clearChat() {
    await supabase.from("chat_messages").delete().eq("user_email", email);
    setMessages([]);
    toast.success("Conversación borrada");
  }

  const empty = messages.length === 0;

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-4xl flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={aiAvatar} alt="" width={40} height={40} className="h-10 w-10 rounded-xl bg-card border" />
          <div>
            <h1 className="font-display text-xl font-bold leading-tight">Asistente Académico IA</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles size={12} className="text-primary" />
              Consultas en lenguaje natural sobre la programación
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Database size={10} /> Conectado a datos en vivo · {snapshot.asignaciones.length} grupos · {snapshot.conflictos.length} conflictos
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat}>
            <Trash2 size={14} /> Limpiar
          </Button>
        )}
      </div>

      {/* Mensajes */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl border bg-card/30 p-4 space-y-6"
      >
        {empty && (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <img src={aiAvatar} alt="" width={96} height={96} className="h-24 w-24 mb-4" />
            <h2 className="font-display text-lg font-bold">Hola, ¿en qué te ayudo?</h2>
            <p className="text-sm text-muted-foreground max-w-md mt-1">
              Pregúntame sobre salones, docentes, horarios, conflictos o cualquier consulta de programación académica.
            </p>
            <div className="mt-6 grid gap-2 w-full max-w-xl">
              {SUGERENCIAS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-sm rounded-lg border bg-background px-4 py-2.5 hover:bg-accent transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <img src={aiAvatar} alt="" width={32} height={32} className="h-8 w-8 rounded-lg shrink-0 mt-0.5" />
            )}
            <div
              className={`max-w-[80%] ${
                m.role === "user"
                  ? "rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-primary-foreground"
                  : "text-foreground"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-headings:mt-3 prose-headings:mb-2 prose-table:my-2">
                  {m.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 size={14} className="animate-spin" /> Pensando…
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
            {m.role === "user" && (
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && !streaming && (
          <div className="flex gap-3">
            <img src={aiAvatar} alt="" width={32} height={32} className="h-8 w-8 rounded-lg shrink-0" />
            <div className="inline-flex items-center gap-2 text-muted-foreground text-sm pt-1">
              <Loader2 size={14} className="animate-spin" /> Pensando…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-end gap-2 rounded-2xl border bg-card p-2"
      >
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Escribe tu consulta… (Enter para enviar, Shift+Enter para nueva línea)"
          rows={1}
          disabled={loading}
          className="flex-1 min-h-[44px] max-h-32 resize-none border-0 focus-visible:ring-0 shadow-none bg-transparent"
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-10 w-10 shrink-0">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </Button>
      </form>
      <p className="mt-2 text-[11px] text-center text-muted-foreground">
        <Bot size={11} className="inline mr-1" />
        Asistente impulsado por IA · Las respuestas se basan en la información del sistema.
      </p>
    </div>
  );
}


