import { asignaturasMock as asignaturasIniciales, PROGRAMAS } from "@/data/mockData";
import { useState } from "react";
import { BookOpen, Filter, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Asignatura } from "@/data/types";

type FormState = {
  nombre: string;
  programa: typeof PROGRAMAS[number];
  semestre: number;
  horasSemanales: number;
  requiereSala: boolean;
  requiereLab: boolean;
};

const emptyForm: FormState = {
  nombre: "",
  programa: PROGRAMAS[0],
  semestre: 1,
  horasSemanales: 3,
  requiereSala: false,
  requiereLab: false,
};

export default function Programas() {
  const [filtro, setFiltro] = useState<string>("todos");
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>(asignaturasIniciales);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const lista = filtro === "todos" ? asignaturas : asignaturas.filter((a) => a.programa === filtro);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setEditOpen(true);
  };

  const openEdit = (a: Asignatura) => {
    setEditId(a.id);
    setForm({
      nombre: a.nombre,
      programa: a.programa as typeof PROGRAMAS[number],
      semestre: a.semestre,
      horasSemanales: a.horasSemanales,
      requiereSala: a.requiereSala,
      requiereLab: a.requiereLab,
    });
    setEditOpen(true);
  };

  const guardar = () => {
    if (!form.nombre.trim()) return toast.error("El nombre es obligatorio");
    if (editId) {
      setAsignaturas((prev) => prev.map((a) => (a.id === editId ? { ...a, ...form } : a)));
      toast.success("Asignatura actualizada");
    } else {
      const id = String(Date.now());
      setAsignaturas((prev) => [...prev, { id, ...form }]);
      toast.success("Asignatura creada");
    }
    setEditOpen(false);
  };

  const confirmarEliminar = () => {
    if (!deleteId) return;
    const found = asignaturas.find((a) => a.id === deleteId);
    setAsignaturas((prev) => prev.filter((a) => a.id !== deleteId));
    toast.success(`"${found?.nombre}" eliminada`);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Asignaturas y Grupos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registro de materias por programa y semestre — Grupos activos.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="rounded-lg border border-input bg-card px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="todos">Todos los programas</option>
            {PROGRAMAS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Nueva asignatura
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold">Asignatura</th>
              <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">Programa</th>
              <th className="px-4 py-3 text-center font-semibold">Sem.</th>
              <th className="px-4 py-3 text-center font-semibold">Hrs/Sem</th>
              <th className="hidden px-4 py-3 text-center font-semibold md:table-cell">Requisitos</th>
              <th className="px-4 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />
                    {a.nombre}
                  </div>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    a.programa === "Ingeniería de Sistemas"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/10 text-accent"
                  }`}>
                    {a.programa === "Ingeniería de Sistemas" ? "Sistemas" : "Industrial"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{a.semestre}</td>
                <td className="px-4 py-3 text-center">{a.horasSemanales}</td>
                <td className="hidden px-4 py-3 text-center md:table-cell">
                  <div className="flex justify-center gap-1">
                    {a.requiereSala && (
                      <span className="rounded bg-info/10 px-1.5 py-0.5 text-[10px] font-medium text-info">Sala PC</span>
                    )}
                    {a.requiereLab && (
                      <span className="rounded bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">Lab</span>
                    )}
                    {!a.requiereSala && !a.requiereLab && (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEdit(a)}
                      aria-label={`Editar ${a.nombre}`}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      <Pencil size={12} /> Editar
                    </button>
                    <button
                      onClick={() => setDeleteId(a.id)}
                      aria-label={`Eliminar ${a.nombre}`}
                      className="inline-flex items-center gap-1 rounded-md border border-destructive/30 bg-background px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No hay asignaturas para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Editar asignatura" : "Nueva asignatura"}</DialogTitle>
            <DialogDescription>
              {editId ? "Modifica los datos y guarda los cambios." : "Completa los datos de la nueva asignatura."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Nombre</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej. Ingeniería de Software"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Programa</label>
                <select
                  value={form.programa}
                  onChange={(e) => setForm({ ...form, programa: e.target.value as typeof PROGRAMAS[number] })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {PROGRAMAS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Semestre</label>
                <input
                  type="number" min={1} max={10}
                  value={form.semestre}
                  onChange={(e) => setForm({ ...form, semestre: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Horas semanales</label>
              <input
                type="number" min={1} max={12}
                value={form.horasSemanales}
                onChange={(e) => setForm({ ...form, horasSemanales: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.requiereSala}
                  onChange={(e) => setForm({ ...form, requiereSala: e.target.checked })}
                /> Requiere sala de cómputo
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.requiereLab}
                  onChange={(e) => setForm({ ...form, requiereLab: e.target.checked })}
                /> Requiere laboratorio
              </label>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setEditOpen(false)}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {editId ? "Guardar cambios" : "Crear asignatura"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar asignatura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Los grupos asociados perderán esta materia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarEliminar}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
