import { Asignatura, Docente, Salon, GrupoAsignado, HorarioSlot } from "./types";

export const PROGRAMAS = ["Ingeniería de Sistemas", "Ingeniería Industrial"] as const;
export const SEMESTRES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const JORNADAS = ["Diurna", "Nocturna"] as const;

export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;

export const BLOQUES_DIURNA: HorarioSlot[] = [
  { inicio: "06:30", fin: "08:00" },
  { inicio: "08:00", fin: "09:30" },
  { inicio: "09:30", fin: "11:00" },
  { inicio: "11:00", fin: "12:30" },
  { inicio: "14:00", fin: "15:30" },
  { inicio: "15:30", fin: "17:00" },
];

export const BLOQUES_NOCTURNA: HorarioSlot[] = [
  { inicio: "18:00", fin: "19:30" },
  { inicio: "19:30", fin: "21:00" },
  { inicio: "21:00", fin: "22:30" },
];

export const asignaturasMock: Asignatura[] = [
  { id: "1", nombre: "Programación I", programa: "Ingeniería de Sistemas", semestre: 1, requiereSala: true, requiereLab: false, horasSemanales: 4 },
  { id: "2", nombre: "Cálculo I", programa: "Ingeniería de Sistemas", semestre: 1, requiereSala: false, requiereLab: false, horasSemanales: 4 },
  { id: "3", nombre: "Física I", programa: "Ingeniería de Sistemas", semestre: 2, requiereSala: false, requiereLab: true, horasSemanales: 4 },
  { id: "4", nombre: "Bases de Datos", programa: "Ingeniería de Sistemas", semestre: 5, requiereSala: true, requiereLab: false, horasSemanales: 3 },
  { id: "5", nombre: "Ingeniería de Software", programa: "Ingeniería de Sistemas", semestre: 7, requiereSala: true, requiereLab: false, horasSemanales: 3 },
  { id: "6", nombre: "Procesos Industriales", programa: "Ingeniería Industrial", semestre: 4, requiereSala: false, requiereLab: true, horasSemanales: 4 },
  { id: "7", nombre: "Investigación de Operaciones", programa: "Ingeniería Industrial", semestre: 6, requiereSala: false, requiereLab: false, horasSemanales: 3 },
  { id: "8", nombre: "Control de Calidad", programa: "Ingeniería Industrial", semestre: 7, requiereSala: false, requiereLab: true, horasSemanales: 3 },
  { id: "9", nombre: "Redes de Computadores", programa: "Ingeniería de Sistemas", semestre: 6, requiereSala: true, requiereLab: false, horasSemanales: 3 },
  { id: "10", nombre: "Logística", programa: "Ingeniería Industrial", semestre: 8, requiereSala: false, requiereLab: false, horasSemanales: 3 },
];

export const docentesMock: Docente[] = [
  { id: "1", nombre: "Carlos Pérez", email: "cperez@unilibre.edu.co", telefono: "3001234567", especialidad: "Programación", disponibilidad: [
    { dia: "Lunes", bloques: [{ inicio: "06:30", fin: "12:30" }] },
    { dia: "Martes", bloques: [{ inicio: "06:30", fin: "12:30" }] },
    { dia: "Miércoles", bloques: [{ inicio: "06:30", fin: "12:30" }] },
    { dia: "Jueves", bloques: [{ inicio: "06:30", fin: "12:30" }] },
    { dia: "Viernes", bloques: [{ inicio: "06:30", fin: "12:30" }] },
  ]},
  { id: "2", nombre: "María López", email: "mlopez@unilibre.edu.co", telefono: "3009876543", especialidad: "Matemáticas", disponibilidad: [
    { dia: "Lunes", bloques: [{ inicio: "06:30", fin: "17:00" }] },
    { dia: "Martes", bloques: [{ inicio: "06:30", fin: "17:00" }] },
    { dia: "Miércoles", bloques: [{ inicio: "06:30", fin: "17:00" }] },
  ]},
  { id: "3", nombre: "Roberto García", email: "rgarcia@unilibre.edu.co", telefono: "3005551234", especialidad: "Física", disponibilidad: [
    { dia: "Lunes", bloques: [{ inicio: "14:00", fin: "22:30" }] },
    { dia: "Martes", bloques: [{ inicio: "14:00", fin: "22:30" }] },
    { dia: "Jueves", bloques: [{ inicio: "14:00", fin: "22:30" }] },
  ]},
  { id: "4", nombre: "Ana Martínez", email: "amartinez@unilibre.edu.co", telefono: "3007778899", especialidad: "Ingeniería Industrial", disponibilidad: [
    { dia: "Lunes", bloques: [{ inicio: "06:30", fin: "12:30" }] },
    { dia: "Martes", bloques: [{ inicio: "06:30", fin: "12:30" }] },
    { dia: "Miércoles", bloques: [{ inicio: "06:30", fin: "12:30" }] },
    { dia: "Jueves", bloques: [{ inicio: "06:30", fin: "12:30" }] },
    { dia: "Viernes", bloques: [{ inicio: "06:30", fin: "12:30" }] },
  ]},
  { id: "5", nombre: "Jorge Ramírez", email: "jramirez@unilibre.edu.co", telefono: "3003332211", especialidad: "Redes y Telecomunicaciones", disponibilidad: [
    { dia: "Lunes", bloques: [{ inicio: "18:00", fin: "22:30" }] },
    { dia: "Martes", bloques: [{ inicio: "18:00", fin: "22:30" }] },
    { dia: "Miércoles", bloques: [{ inicio: "18:00", fin: "22:30" }] },
    { dia: "Jueves", bloques: [{ inicio: "18:00", fin: "22:30" }] },
  ]},
];

export const salonesMock: Salon[] = [
  { id: "1", nombre: "Salón 101", tipo: "teórico", capacidad: 40, edificio: "Bloque A" },
  { id: "2", nombre: "Salón 102", tipo: "teórico", capacidad: 35, edificio: "Bloque A" },
  { id: "3", nombre: "Salón 201", tipo: "teórico", capacidad: 50, edificio: "Bloque B" },
  { id: "4", nombre: "Sala de Cómputo 1", tipo: "sala_computo", capacidad: 30, edificio: "Bloque C" },
  { id: "5", nombre: "Sala de Cómputo 2", tipo: "sala_computo", capacidad: 25, edificio: "Bloque C" },
  { id: "6", nombre: "Laboratorio de Física", tipo: "laboratorio", capacidad: 20, edificio: "Bloque D" },
  { id: "7", nombre: "Laboratorio de Procesos", tipo: "laboratorio", capacidad: 25, edificio: "Bloque D" },
  { id: "8", nombre: "Salón 301", tipo: "teórico", capacidad: 45, edificio: "Bloque B" },
];

export const asignacionesMock: GrupoAsignado[] = [
  { id: "1", asignaturaId: "1", docenteId: "1", salonId: "4", grupo: "A", programa: "Ingeniería de Sistemas", semestre: 1, jornada: "Diurna", numEstudiantes: 28, horarios: [
    { dia: "Lunes", bloque: { inicio: "06:30", fin: "08:00" } },
    { dia: "Miércoles", bloque: { inicio: "06:30", fin: "08:00" } },
  ]},
  { id: "2", asignaturaId: "2", docenteId: "2", salonId: "1", grupo: "A", programa: "Ingeniería de Sistemas", semestre: 1, jornada: "Diurna", numEstudiantes: 35, horarios: [
    { dia: "Martes", bloque: { inicio: "08:00", fin: "09:30" } },
    { dia: "Miércoles", bloque: { inicio: "08:00", fin: "09:30" } },
  ]},
  { id: "3", asignaturaId: "3", docenteId: "3", salonId: "6", grupo: "A", programa: "Ingeniería de Sistemas", semestre: 2, jornada: "Diurna", numEstudiantes: 18, horarios: [
    { dia: "Martes", bloque: { inicio: "14:00", fin: "15:30" } },
    { dia: "Jueves", bloque: { inicio: "14:00", fin: "15:30" } },
  ]},
  { id: "4", asignaturaId: "6", docenteId: "4", salonId: "7", grupo: "A", programa: "Ingeniería Industrial", semestre: 4, jornada: "Diurna", numEstudiantes: 22, horarios: [
    { dia: "Lunes", bloque: { inicio: "08:00", fin: "09:30" } },
    { dia: "Jueves", bloque: { inicio: "08:00", fin: "09:30" } },
  ]},
  { id: "5", asignaturaId: "9", docenteId: "5", salonId: "4", grupo: "A", programa: "Ingeniería de Sistemas", semestre: 6, jornada: "Nocturna", numEstudiantes: 20, horarios: [
    { dia: "Lunes", bloque: { inicio: "18:00", fin: "19:30" } },
    { dia: "Miércoles", bloque: { inicio: "18:00", fin: "19:30" } },
  ]},
];
