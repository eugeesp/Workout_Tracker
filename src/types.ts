export type Grupo = "pecho" | "espalda" | "biceps" | "triceps" | "hombro" | "pierna" | "activacion";

export type Series = number | `${number}-${number}`;

export type SerieLog = {
  reps?: string;
  peso?: string;
  rir?: string;
  note?: string;
};

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
  sets: SerieLog[];
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
