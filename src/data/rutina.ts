import { DiaRutina, Grupo } from "../types";

export const colorLegend: Record<Grupo, { bg: string; border: string; text: string }> = {
  pecho: { bg: "bg-red-100", border: "border-red-300", text: "text-red-900" },
  espalda: {
    bg: "bg-green-100",
    border: "border-green-300",
    text: "text-green-900",
  },
  biceps: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-900",
  },
  triceps: {
    bg: "bg-purple-100",
    border: "border-purple-300",
    text: "text-purple-900",
  },
  hombro: {
    bg: "bg-orange-100",
    border: "border-orange-300",
    text: "text-orange-900",
  },
  pierna: {
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    text: "text-yellow-900",
  },
  activacion: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-900",
  },
};

export const rutina: Record<"lunes" | "martes" | "miercoles" | "jueves" | "viernes", DiaRutina> = {
  lunes: {
    nombre: "LUNES - Pecho / Bíceps / Posterior 💪",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (polea alta unilateral)",
        series: 1,
        reps: "15-20",
        grupo: "activacion",
      },
      {
        nombre: "Press banca (barra plano)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "pecho",
      },
      {
        nombre: "Press inclinado (barra)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "pecho",
      },
      {
        nombre: "Cruce de poleas (pecho)",
        series: 4,
        reps: "12-15",
        grupo: "pecho",
      },
      {
        nombre: "Curl bíceps barra W",
        series: 3,
        reps: "12-15",
        grupo: "biceps",
      },
      {
        nombre: "Curl bíceps alternado",
        series: 4,
        reps: "12-15",
        grupo: "biceps",
      },
      {
        nombre: "Face pull (cuerda)",
        series: 4,
        reps: "12-15 → 15-20",
        grupo: "hombro",
      },
    ],
  },
  martes: {
    nombre: "MARTES - Espalda / Tríceps / Posterior 💪",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (polea alta unilateral)",
        series: 1,
        reps: "15-20",
        grupo: "activacion",
      },
      {
        nombre: "Remo con barra (pesado)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "espalda",
      },
      {
        nombre: "Jalón neutro (agarre paralelo)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "espalda",
      },
      {
        nombre: "Jalón prono al pecho",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "espalda",
      },
      {
        nombre: "Extensión tríceps soga",
        series: 4,
        reps: "12-15",
        grupo: "triceps",
      },
      {
        nombre: "Press francés (barra W)",
        series: "3-4",
        reps: "12-15",
        grupo: "triceps",
      },
      {
        nombre: "Peck-deck reverse",
        series: 4,
        reps: "12-15 → 15-20",
        grupo: "hombro",
      },
    ],
  },
  miercoles: {
    nombre: "MIÉRCOLES - Pierna / Deltoides Medio / Posterior 🦵",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (polea alta unilateral)",
        series: 1,
        reps: "15-20",
        grupo: "activacion",
      },
      {
        nombre: "Sentadilla (barra)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "pierna",
      },
      {
        nombre: "Hack squat",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "pierna",
      },
      {
        nombre: "Curl femoral acostado",
        series: 4,
        reps: "12-15",
        grupo: "pierna",
      },
      {
        nombre: "Extensión cuádriceps",
        series: 4,
        reps: "12-15",
        grupo: "pierna",
      },
      {
        nombre: "Elevación lateral (polea)",
        series: 4,
        reps: "12-15",
        grupo: "hombro",
      },
      {
        nombre: "Posterior polea cruzada (unilateral)",
        series: 4,
        reps: "12-15 → 15-20",
        grupo: "hombro",
      },
    ],
  },
  jueves: {
    nombre: "JUEVES - Tren Superior (Push + Pull) 💪",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (micro)",
        series: 1,
        reps: "10-15",
        grupo: "activacion",
      },
      {
        nombre: "Press inclinado (mancuernas)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "pecho",
      },
      {
        nombre: "Remo T / Hammer (controlado)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "espalda",
      },
      {
        nombre: "Press militar (barra)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "hombro",
      },
      {
        nombre: "Jalón al pecho",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "espalda",
      },
      {
        nombre: "Curl bíceps (variante libre)",
        series: 3,
        reps: "12-15",
        grupo: "biceps",
      },
      {
        nombre: "Extensión tríceps unilateral",
        series: "3-4",
        reps: "12-15",
        grupo: "triceps",
      },
    ],
  },
  viernes: {
    nombre: "VIERNES - Pierna / Hombro (medio + posterior) 🦵",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (polea alta unilateral)",
        series: 1,
        reps: "15-20",
        grupo: "activacion",
      },
      {
        nombre: "Peso muerto rumano",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "pierna",
      },
      {
        nombre: "Prensa 45°",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        grupo: "pierna",
      },
      {
        nombre: "Curl femoral (acostado o sentado)",
        series: 4,
        reps: "12-15",
        grupo: "pierna",
      },
      {
        nombre: "Extensión cuádriceps",
        series: 4,
        reps: "12-15",
        grupo: "pierna",
      },
      {
        nombre: "Elevación lateral (polea)",
        series: 4,
        reps: "12-15",
        grupo: "hombro",
      },
      {
        nombre: "Pájaros / reverse fly banco inclinado",
        series: 4,
        reps: "12-15 → 15-20",
        grupo: "hombro",
      },
    ],
  },
};

export const abdominales = [
  { nombre: "Crunch en polea alta", reps: "12-15", series: "3-4" },
  { nombre: "Ab machine con peso", reps: "12-15", series: "3-4" },
  { nombre: "Plancha (opcional)", reps: "30-60s", series: "2-3" },
];

export const dias: Array<keyof typeof rutina> = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
];
