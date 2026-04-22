import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { asignaturasMock, docentesMock, salonesMock } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  CalendarDays,
  Users,
  Building2,
  FileText,
  BarChart3,
  AlertTriangle,
  Shield,
  Clock,
  Bell,
  Settings,
  BookOpen,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Cmd/Ctrl + K to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const role = user?.role;

  const navItems =
    role === "admin"
      ? [
          { label: "Inicio", path: "/", icon: Home },
          { label: "Alertas de Conflictos", path: "/alertas", icon: AlertTriangle },
          { label: "Estadísticas de Salones", path: "/estadisticas", icon: BarChart3 },
          { label: "Usuarios y Roles", path: "/usuarios", icon: Shield },
        ]
      : role === "secretaria"
      ? [
          { label: "Inicio", path: "/", icon: Home },
          { label: "Programación Académica", path: "/programacion", icon: CalendarDays },
          { label: "Docentes", path: "/docentes", icon: Users },
          { label: "Infraestructura", path: "/salones", icon: Building2 },
          { label: "Asignaturas y Grupos", path: "/asignaturas", icon: FileText },
          { label: "Reportes", path: "/reportes", icon: BarChart3 },
          { label: "Conflictos", path: "/conflictos", icon: AlertTriangle },
        ]
      : [
          { label: "Inicio", path: "/", icon: Home },
          { label: "Mi Horario", path: "/mi-horario", icon: CalendarDays },
          { label: "Disponibilidad", path: "/disponibilidad", icon: Clock },
        ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar páginas, docentes, asignaturas, salones..." />
      <CommandList>
        <CommandEmpty>Sin resultados</CommandEmpty>

        <CommandGroup heading="Navegación">
          {navItems.map((item) => (
            <CommandItem key={item.path} value={`nav ${item.label}`} onSelect={() => go(item.path)}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
          <CommandItem value="nav notificaciones" onSelect={() => go("/notificaciones")}>
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </CommandItem>
          <CommandItem value="nav configuracion" onSelect={() => go("/configuracion")}>
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </CommandItem>
        </CommandGroup>

        {role !== "docente" && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Asignaturas">
              {asignaturasMock.slice(0, 8).map((a) => (
                <CommandItem key={a.id} value={`asig ${a.nombre} ${a.programa}`} onSelect={() => go("/asignaturas")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{a.nombre}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Sem. {a.semestre}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Docentes">
              {docentesMock.map((d) => (
                <CommandItem key={d.id} value={`doc ${d.nombre} ${d.especialidad}`} onSelect={() => go("/docentes")}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>{d.nombre}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{d.especialidad}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Salones">
              {salonesMock.map((s) => (
                <CommandItem key={s.id} value={`sal ${s.nombre} ${s.edificio}`} onSelect={() => go("/salones")}>
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>{s.nombre}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{s.edificio}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
