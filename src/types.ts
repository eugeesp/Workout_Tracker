export type Grupo = "pecho" | "espalda" | "biceps" | "triceps" | "hombro" | "pierna" | "activacion";

export type Series = number | `${number}-${number}`;

export interface Ejercicio {
  id?: string;
  nombre: string;
  grupo: Grupo;
  series: Series;
  reps: string;
}

export interface DiaRutina {
  nombre: string;
  ejercicios: Ejercicio[];
}

export interface SessionExercise {
  sets: Array<{ peso?: string; reps?: string; rir?: string }>;
  alt?: string;
  notes?: string;
  completed: boolean;
}

export interface WorkoutSession {
  date: string;
  day: "lunes" | "martes" | "miercoles" | "jueves" | "viernes";
  exercises: Record<string, SessionExercise>;
  totalVolume: number;
  bodyWeight?: number;
  duration?: number;
}
