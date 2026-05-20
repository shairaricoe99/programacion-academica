// Edge function: streaming chat con Lovable AI Gateway
// Recibe `messages` y un `context` dinámico (snapshot vivo del sistema) desde el cliente.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_PROMPT = `Eres "Asistente Académico UL", consultor experto de la Facultad de Ingeniería de la Universidad Libre seccional Barranquilla.

ROL
- Responde consultas en lenguaje natural sobre programación académica, docentes, salones, asignaturas, horarios y conflictos.
- SIEMPRE respondes en español, de forma profesional, precisa y concisa.
- Usa markdown (tablas, listas) cuando enumeres datos.

REGLAS CRÍTICAS
- Los DATOS DEL SISTEMA que aparecen abajo en JSON son la ÚNICA fuente de verdad. NO inventes docentes, salones, asignaturas, grupos ni horarios que no estén ahí.
- Si te piden algo que no está en los datos, dilo explícitamente y sugiere consultar con Secretaría Académica.
- Para "salones libres" en un día/franja: parte de los bloques estándar y resta los que estén ocupados según las asignaciones.
- Para "carga académica de un docente": suma las horas/grupos donde aparece como docente en las asignaciones.
- Para "conflictos": usa el array conflictos (no inventes nuevos).
- Sé breve por defecto; expande sólo si lo piden.
- Cuando cites docentes o salones, usa el nombre exacto que aparece en el JSON.
`;

function buildSystemPrompt(context: unknown) {
  if (!context) return BASE_PROMPT;
  const json = JSON.stringify(context, null, 2);
  return `${BASE_PROMPT}\n\n## DATOS DEL SISTEMA (snapshot en vivo)\n\n\`\`\`json\n${json}\n\`\`\``;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY no configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = buildSystemPrompt(context);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 429)
        return new Response(JSON.stringify({ error: "Límite de solicitudes alcanzado. Intenta en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (response.status === 402)
        return new Response(
          JSON.stringify({ error: "Créditos agotados. Agrega créditos en Configuración de Lovable Cloud." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      return new Response(JSON.stringify({ error: text }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});


