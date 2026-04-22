export interface HorarioSlot {
  inicio: string;
  fin: string;
}

export interface DisponibilidadDia {
  dia: string;
  bloques: HorarioSlot[];
}

export interface Docente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  disponibilidad: DisponibilidadDia[];
}

export interface Asignatura {
  id: string;
  nombre: string;
  programa: string;
  semestre: number;
  requiereSala: boolean;
  requiereLab: boolean;
  horasSemanales: number;
}

export interface Salon {
  id: string;
  nombre: string;
  tipo: "teórico" | "sala_computo" | "laboratorio";
  capacidad: number;
  edificio: string;
}

export interface HorarioAsignado {
  dia: string;
  bloque: HorarioSlot;
}

export interface GrupoAsignado {
  id: string;
  asignaturaId: string;
  docenteId: string;
  salonId: string;
  grupo: string;
  programa: string;
  semestre: number;
  jornada: string;
  numEstudiantes: number;
  horarios: HorarioAsignado[];
}
