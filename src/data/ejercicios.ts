
import { Ejercicio, Grupo } from "../types";

export const ejerciciosDB: Ejercicio[] = [
  // === ACTIVACIÓN ===
  {
    id: "activacion-posterior-polea",
    nombre: "Activación deltoides posterior (polea alta unilateral)",
    grupo: "activacion",
    series: 1,
    reps: "15-20",
    rpe: "4-5",
    tempo: "1-0-3-2",
    nota: "Enfoque en conexión mente-músculo",
  },
  {
    id: "activacion-posterior-micro",
    nombre: "Activación deltoides posterior (micro)",
    grupo: "activacion",
    series: 1,
    reps: "10-15",
    rpe: "3-4",
    nota: "Solo MMC, muy ligero",
  },

  // === PECHO ===
  {
    id: "press-banca-barra",
    nombre: "Press banca (barra plano)",
    grupo: "pecho",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7-8",
    tempo: "2-0-3-0",
    nota: "back-off",
  },
  {
    id: "press-inclinado-barra",
    nombre: "Press inclinado (barra)",
    grupo: "pecho",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7-8",
    nota: "back-off",
  },
  {
    id: "press-inclinado-mancuernas",
    nombre: "Press inclinado (mancuernas)",
    grupo: "pecho",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7",
    nota: "back-off",
  },
  {
    id: "cruce-poleas-pecho",
    nombre: "Cruce de poleas (pecho)",
    grupo: "pecho",
    series: 4,
    reps: "12-15",
    rpe: "7",
    tempo: "1-0-3-1",
  },

  // === ESPALDA ===
  {
    id: "remo-barra-pesado",
    nombre: "Remo con barra (pesado)",
    grupo: "espalda",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7-8",
    nota: "back-off",
  },
  {
    id: "jalon-neutro-paralelo",
    nombre: "Jalón neutro (agarre paralelo)",
    grupo: "espalda",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7-8",
    nota: "espalda alta",
  },
  {
    id: "jalon-prono-pecho",
    nombre: "Jalón prono al pecho",
    grupo: "espalda",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7",
    nota: "control excéntrico",
  },
  {
    id: "remo-t-hammer",
    nombre: "Remo T / Hammer (controlado)",
    grupo: "espalda",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7",
    tempo: "2-1-3-1",
    nota: "enfoque MMC / escápula",
  },
  {
    id: "jalon-al-pecho",
    nombre: "Jalón al pecho",
    grupo: "espalda",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7",
    nota: "lat stretch",
  },

  // === HOMBROS ===
  {
    id: "face-pull-cuerda",
    nombre: "Face pull (cuerda)",
    grupo: "hombro",
    series: 4,
    reps: "12-15 → 15-20",
    rpe: "7",
    tempo: "1-1-3-1",
  },
  {
    id: "peck-deck-reverse",
    nombre: "Peck-deck reverse",
    grupo: "hombro",
    series: 4,
    reps: "12-15 → 15-20",
    rpe: "7",
    tempo: "1-0-3-2",
  },
  {
    id: "elevacion-lateral-polea",
    nombre: "Elevación lateral (polea)",
    grupo: "hombro",
    series: 4,
    reps: "12-15",
    rpe: "7",
    tempo: "1-0-3-1",
  },
  {
    id: "posterior-polea-cruzada",
    nombre: "Posterior polea cruzada (unilateral)",
    grupo: "hombro",
    series: 4,
    reps: "12-15 → 15-20",
    rpe: "7",
    tempo: "1-0-3-2",
  },
  {
    id: "press-militar-barra",
    nombre: "Press militar (barra)",
    grupo: "hombro",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7-8",
    nota: "controlado",
  },
  {
    id: "pajaros-reverse-fly",
    nombre: "Pájaros / reverse fly banco inclinado",
    grupo: "hombro",
    series: 4,
    reps: "12-15 → 15-20",
    rpe: "7",
    tempo: "1-0-3-2",
  },

  // === BÍCEPS ===
  {
    id: "curl-biceps-barra-w",
    nombre: "Curl bíceps barra W",
    grupo: "biceps",
    series: 3,
    reps: "12-15",
    rpe: "7",
    tempo: "1-0-3-1",
  },
  {
    id: "curl-biceps-alternado",
    nombre: "Curl bíceps alternado",
    grupo: "biceps",
    series: 4,
    reps: "12-15",
    rpe: "7",
    tempo: "1-0-3-1",
  },
  {
    id: "curl-biceps-variante",
    nombre: "Curl bíceps (variante libre)",
    grupo: "biceps",
    series: 3,
    reps: "12-15",
    rpe: "7",
    tempo: "1-0-3-1",
  },

  // === TRÍCEPS ===
  {
    id: "extension-triceps-soga",
    nombre: "Extensión tríceps soga",
    grupo: "triceps",
    series: 4,
    reps: "12-15",
    rpe: "7",
    tempo: "1-0-3-1",
  },
  {
    id: "press-frances-barra-w",
    nombre: "Press francés (barra W)",
    grupo: "triceps",
    series: "3-4",
    reps: "12-15",
    rpe: "7",
    nota: "codos fijos",
  },
  {
    id: "extension-triceps-unilateral",
    nombre: "Extensión tríceps unilateral",
    grupo: "triceps",
    series: "3-4",
    reps: "12-15",
    rpe: "7",
    tempo: "1-0-3-1",
  },

  // === PIERNAS ===
  {
    id: "sentadilla-barra",
    nombre: "Sentadilla (barra)",
    grupo: "pierna",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7-8",
    nota: "back-off",
  },
  {
    id: "hack-squat",
    nombre: "Hack squat",
    grupo: "pierna",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7-8",
    nota: "back-off",
  },
  {
    id: "curl-femoral-acostado",
    nombre: "Curl femoral acostado",
    grupo: "pierna",
    series: 4,
    reps: "12-15",
    rpe: "7",
    tempo: "1-0-3-1",
  },
  {
    id: "extension-cuadriceps",
    nombre: "Extensión cuádriceps",
    grupo: "pierna",
    series: 4,
    reps: "12-15",
    rpe: "7",
    nota: "pausa",
  },
  {
    id: "peso-muerto-rumano",
    nombre: "Peso muerto rumano",
    grupo: "pierna",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7-8",
    nota: "back-off",
  },
  {
    id: "prensa-45",
    nombre: "Prensa 45°",
    grupo: "pierna",
    series: 3,
    reps: "8-10 / 9-11 / 10-12",
    rpe: "7-8",
    nota: "back-off",
  },
  {
    id: "curl-femoral-variante",
    nombre: "Curl femoral (acostado o sentado)",
    grupo: "pierna",
    series: 4,
    reps: "12-15",
    rpe: "7",
    tempo: "1-0-3-1",
  },
];



export const ejerciciosPorGrupo = (grupo: Grupo): Ejercicio[] => {
  return ejerciciosDB.filter((ej) => ej.grupo === grupo);
};

export const buscarEjercicios = (termino: string): Ejercicio[] => {
  if (!termino || termino.length < 2) return [];
  const lowerTermino = termino.toLowerCase();
  return ejerciciosDB.filter(
    (ej) =>
      ej.nombre.toLowerCase().includes(lowerTermino) ||
      ej.grupo.toLowerCase().includes(lowerTermino)
  );
};
