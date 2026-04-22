import { useMemo, useState } from "react";
import { Bell, Trash2, CheckCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAppState, notifIconMap } from "@/contexts/AppStateContext";

export default function Notificaciones() {
  const { user } = useAuth();
  const { notifs, markNotifRead, markAllNotifsRead, deleteNotif, clearNotifs } = useAppState();
  const [filter, setFilter] = useState<"todas" | "no_leidas">("todas");

  const visiblesPorRol = useMemo(
    () => notifs.filter((n) => !user || n.rol.includes(user.role)),
    [notifs, user]
  );
  const noLeidasCount = visiblesPorRol.filter((n) => !n.leida).length;
  const visibles = filter === "no_leidas" ? visiblesPorRol.filter((n) => !n.leida) : visiblesPorRol;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide">Notificaciones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {noLeidasCount > 0 ? `Tienes ${noLeidasCount} sin leer` : "Estás al día"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              markAllNotifsRead();
              toast.success("Todas las notificaciones marcadas como leídas");
            }}
            disabled={noLeidasCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
          >
            <CheckCheck size={14} /> Marcar todas como leídas
          </button>
          <button
            onClick={() => {
              clearNotifs();
              toast("Notificaciones eliminadas");
            }}
            disabled={visiblesPorRol.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-card px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
          >
            <Trash2 size={14} /> Limpiar todo
          </button>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1 w-fit">
        {[
          { key: "todas" as const, label: `Todas (${visiblesPorRol.length})` },
          { key: "no_leidas" as const, label: `Sin leer (${noLeidasCount})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              filter === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visibles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Bell size={32} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">No hay notificaciones</p>
          </div>
        ) : (
          visibles.map((n) => {
            const cfg = notifIconMap[n.tipo];
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                  n.leida ? "border-border bg-card" : "border-primary/30 bg-primary/5"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{n.titulo}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.desc}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock size={11} /> {n.hora}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!n.leida && (
                    <button
                      onClick={() => markNotifRead(n.id)}
                      className="rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-semibold hover:bg-muted"
                    >
                      Marcar leída
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteNotif(n.id);
                      toast("Notificación eliminada");
                    }}
                    aria-label="Eliminar"
                    className="rounded-md border border-border bg-background p-1.5 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// Live unread counter for header badge
export function useUnreadCount() {
  const { user } = useAuth();
  const { notifs } = useAppState();
  if (!user) return 0;
  return notifs.filter((n) => n.rol.includes(user.role) && !n.leida).length;
}
