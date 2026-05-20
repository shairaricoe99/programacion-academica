import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key no configurada. Contacta al administrador." }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const { messages, context } = await req.json();

    const systemPrompt = `Eres el Asistente Académico IA del sistema de programación de la
Facultad de Ingeniería, Universidad Libre Sede Barranquilla.
Tienes acceso en tiempo real al estado completo del sistema:

${JSON.stringify(context, null, 2)}

Responde siempre en español, de forma clara y concisa.
Usa tablas Markdown cuando muestres listas de horarios, salones o docentes.
Si hay conflictos de horario, menciónalos proactivamente.
No inventes datos que no estén en el contexto proporcionado.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429)
        return new Response(JSON.stringify({ error: "Límite de uso alcanzado. Intenta en un momento." }), { status: 429, headers: { ...CORS, "Content-Type": "application/json" } });
      if (response.status === 402)
        return new Response(JSON.stringify({ error: "Créditos de IA agotados. Contacta al administrador." }), { status: 402, headers: { ...CORS, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: `Error del proveedor IA: ${response.status}` }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    return new Response(response.body, {
      headers: {
        ...CORS,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
