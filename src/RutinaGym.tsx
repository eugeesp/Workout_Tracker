import React, { useEffect, useMemo, useState, useRef } from "react";

// =======================
// IndexedDB Helper (para persistencia confiable en iOS)
// =======================

const DB_NAME = "RutinaGymDB";
const DB_VERSION = 1;
const STORE_NAME = "workoutData";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

const getFromDB = async (key: string): Promise<any> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error reading from IndexedDB:", error);
    return null;
  }
};

const saveToDB = async (key: string, value: any): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Error saving to IndexedDB:", error);
  }
};

// =======================
// Tipos
// =======================

type Grupo =
  | "pecho"
  | "espalda"
  | "biceps"
  | "triceps"
  | "hombro"
  | "pierna"
  | "activacion";

type Series = number | `${number}-${number}`;

interface Ejercicio {
  id?: string;
  nombre: string;
  series: Series;
  reps: string;
  rpe: string;
  tempo?: string;
  nota?: string;
  grupo: Grupo;
}

interface DiaRutina {
  nombre: string;
  ejercicios: Ejercicio[];
}

interface SessionExercise {
  sets: Array<{ peso?: string; reps?: string; rir?: string }>;
  alt?: string;
  notes?: string; // NUEVO
  completed: boolean;
}

interface WorkoutSession {
  date: string;
  day: keyof typeof rutina;
  exercises: Record<string, SessionExercise>;
  totalVolume: number;
  bodyWeight?: number; // NUEVO
  duration?: number;
}

// =======================
// Base de Datos de Ejercicios
// =======================

const ejerciciosDB: Ejercicio[] = [
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

// Helper para buscar ejercicios por grupo
const ejerciciosPorGrupo = (grupo: Grupo): Ejercicio[] => {
  return ejerciciosDB.filter((ej) => ej.grupo === grupo);
};

// Helper para buscar ejercicios por nombre (búsqueda flexible)
const buscarEjercicios = (termino: string): Ejercicio[] => {
  const lowerTermino = termino.toLowerCase();
  return ejerciciosDB.filter(
    (ej) =>
      ej.nombre.toLowerCase().includes(lowerTermino) ||
      ej.grupo.toLowerCase().includes(lowerTermino)
  );
};

// =======================
// Datos
// =======================

const colorLegend: Record<Grupo, { bg: string; border: string; text: string }> =
  {
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

const rutina: Record<
  "lunes" | "martes" | "miercoles" | "jueves" | "viernes",
  DiaRutina
> = {
  lunes: {
    nombre: "LUNES - Pecho / Bíceps / Posterior 💪",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (polea alta unilateral)",
        series: 1,
        reps: "15-20",
        rpe: "4-5",
        tempo: "1-0-3-2",
        grupo: "activacion",
      },
      {
        nombre: "Press banca (barra plano)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7-8",
        tempo: "2-0-3-0",
        nota: "back-off",
        grupo: "pecho",
      },
      {
        nombre: "Press inclinado (barra)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7-8",
        nota: "back-off",
        grupo: "pecho",
      },
      {
        nombre: "Cruce de poleas (pecho)",
        series: 4,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "pecho",
      },
      {
        nombre: "Curl bíceps barra W",
        series: 3,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "biceps",
      },
      {
        nombre: "Curl bíceps alternado",
        series: 4,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "biceps",
      },
      {
        nombre: "Face pull (cuerda)",
        series: 4,
        reps: "12-15 → 15-20",
        rpe: "7",
        tempo: "1-1-3-1",
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
        rpe: "4-5",
        tempo: "1-0-3-2",
        grupo: "activacion",
      },
      {
        nombre: "Remo con barra (pesado)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7-8",
        nota: "back-off",
        grupo: "espalda",
      },
      {
        nombre: "Jalón neutro (agarre paralelo)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7-8",
        nota: "espalda alta",
        grupo: "espalda",
      },
      {
        nombre: "Jalón prono al pecho",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7",
        nota: "control excéntrico",
        grupo: "espalda",
      },
      {
        nombre: "Extensión tríceps soga",
        series: 4,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "triceps",
      },
      {
        nombre: "Press francés (barra W)",
        series: "3-4",
        reps: "12-15",
        rpe: "7",
        nota: "codos fijos",
        grupo: "triceps",
      },
      {
        nombre: "Peck-deck reverse",
        series: 4,
        reps: "12-15 → 15-20",
        rpe: "7",
        tempo: "1-0-3-2",
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
        rpe: "4-5",
        tempo: "1-0-3-2",
        grupo: "activacion",
      },
      {
        nombre: "Sentadilla (barra)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7-8",
        nota: "back-off",
        grupo: "pierna",
      },
      {
        nombre: "Hack squat",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7-8",
        nota: "back-off",
        grupo: "pierna",
      },
      {
        nombre: "Curl femoral acostado",
        series: 4,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "pierna",
      },
      {
        nombre: "Extensión cuádriceps",
        series: 4,
        reps: "12-15",
        rpe: "7",
        nota: "pausa",
        grupo: "pierna",
      },
      {
        nombre: "Elevación lateral (polea)",
        series: 4,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "hombro",
      },
      {
        nombre: "Posterior polea cruzada (unilateral)",
        series: 4,
        reps: "12-15 → 15-20",
        rpe: "7",
        tempo: "1-0-3-2",
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
        rpe: "3-4",
        nota: "solo MMC",
        grupo: "activacion",
      },
      {
        nombre: "Press inclinado (mancuernas)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7",
        nota: "back-off",
        grupo: "pecho",
      },
      {
        nombre: "Remo T / Hammer (controlado)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7",
        tempo: "2-1-3-1",
        nota: "enfoque MMC / escápula",
        grupo: "espalda",
      },
      {
        nombre: "Press militar (barra)",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7-8",
        nota: "controlado",
        grupo: "hombro",
      },
      {
        nombre: "Jalón al pecho",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7",
        nota: "lat stretch",
        grupo: "espalda",
      },
      {
        nombre: "Curl bíceps (variante libre)",
        series: 3,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "biceps",
      },
      {
        nombre: "Extensión tríceps unilateral",
        series: "3-4",
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
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
        rpe: "4-5",
        tempo: "1-0-3-2",
        grupo: "activacion",
      },
      {
        nombre: "Peso muerto rumano",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7-8",
        nota: "back-off",
        grupo: "pierna",
      },
      {
        nombre: "Prensa 45°",
        series: 3,
        reps: "8-10 / 9-11 / 10-12",
        rpe: "7-8",
        nota: "back-off",
        grupo: "pierna",
      },
      {
        nombre: "Curl femoral (acostado o sentado)",
        series: 4,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "pierna",
      },
      {
        nombre: "Extensión cuádriceps",
        series: 4,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "pierna",
      },
      {
        nombre: "Elevación lateral (polea)",
        series: 4,
        reps: "12-15",
        rpe: "7",
        tempo: "1-0-3-1",
        grupo: "hombro",
      },
      {
        nombre: "Pájaros / reverse fly banco inclinado",
        series: 4,
        reps: "12-15 → 15-20",
        rpe: "7",
        tempo: "1-0-3-2",
        grupo: "hombro",
      },
    ],
  },
};

const abdominales = [
  { nombre: "Crunch en polea alta", reps: "12-15", series: "3-4", rpe: "7-8" },
  { nombre: "Ab machine con peso", reps: "12-15", series: "3-4", rpe: "7-8" },
  { nombre: "Plancha (opcional)", reps: "30-60s", series: "2-3", rpe: "6-7" },
];

const dias: Array<keyof typeof rutina> = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
];

// =======================
// Utilidades
// =======================

const seriesToRange = (s: Series): [number, number] => {
  if (typeof s === "number") return [s, s];
  const [a, b] = s.split("-").map((n) => parseInt(n.trim(), 10));
  return [a, b];
};

const withIds = (d: DiaRutina, prefix: string): DiaRutina => ({
  ...d,
  ejercicios: d.ejercicios.map((e, i) => ({ ...e, id: `${prefix}-E${i + 1}` })),
});

// =======================
// Componente
// =======================

const STORAGE_HISTORY = "rg-history-v2" as const;
const STORAGE_CURRENT = "rg-current-v2" as const;
// ✅ Nuevo: persistir cambios en la rutina editable
const STORAGE_RUTINA = "rg-rutina-v1" as const;

const RutinaGym: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<WorkoutSession[]>([]);

  const [done, setDone] = useState<Record<string, boolean>>({});

  const [logs, setLogs] = useState<
    Record<
      string,
      {
        sets?: Array<{ peso?: string; reps?: string; rir?: string }>;
        alt?: string;
        notes?: string;
      }
    >
  >({});

  const [selectedDay, setSelectedDay] = useState<keyof typeof rutina>(
    (localStorage.getItem("rg-selectedDay") as keyof typeof rutina) || "lunes"
  );

  const [showHistory, setShowHistory] = useState(false);
  const [sessionStartTime] = useState<number>(() => Date.now());
  const [showLegend, setShowLegend] = useState(false);
  // === Resumen EN CURSO (tick para refrescar minutos) ===
  const [nowTick, setNowTick] = useState(0);
  useEffect(() => {
    // Refresca cada 30s para que el contador de minutos avance sin interacción
    const id = setInterval(() => setNowTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Minutos transcurridos desde que se montó la sesión actual
  const elapsedMin = Math.max(
    0,
    Math.round((Date.now() - sessionStartTime) / 60000)
  );

  const [showVolumenSemanal, setShowVolumenSemanal] = useState(false);

  // === NUEVOS ESTADOS: Peso Corporal y Notas ===
  const [bodyWeight, setBodyWeight] = useState<string>("");
  const [exerciseNotes, setExerciseNotes] = useState<Record<string, string>>(
    {}
  );

  // === SELECTOR INTELIGENTE (estado) ===
  const [selectorOpen, setSelectorOpen] = useState<{
    open: boolean;
    targetId?: string;
    grupo?: Grupo;
    mode?: "replace" | "add";
  }>({ open: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Ejercicio[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // === Nuevo: Modal 1RM (Epley) ===
  const [oneRMModal, setOneRMModal] = useState<{
    open: boolean;
    exerciseId?: string;
    currentWeight?: string;
    currentReps?: string;
  }>({ open: false });

  const openOneRMFor = (exerciseId?: string) => {
    // usar último set completado o primer set por defecto
    const k = `${selectedDay}:${exerciseId ?? ""}`;
    const filled = (logs[k]?.sets ?? []).filter(
      (s: any) =>
        !!s &&
        (s.peso ?? "").toString().trim() !== "" &&
        (s.reps ?? "").toString().trim() !== ""
    );
    const last =
      filled.length > 0
        ? filled[filled.length - 1]
        : getSets(exerciseId, 3)[0] || { peso: "", reps: "" };
    setOneRMModal({
      open: true,
      exerciseId,
      currentWeight: (last.peso ?? "").toString(),
      currentReps: (last.reps ?? "").toString(),
    });
  };

  const parseNumber = (v?: string) => {
    const n = parseFloat((v ?? "").toString().replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };

  // === Nuevo: parsear RIR desde string "2" o "2-1" a [min, max] ===
  const parseRIR = (rirStr?: string): [number | null, number | null] => {
    if (!rirStr || !rirStr.trim()) return [null, null];
    const parts = rirStr
      .trim()
      .split("-")
      .map((p) => {
        const n = parseInt(p.trim(), 10);
        return Number.isFinite(n) && n >= 0 ? n : null;
      });
    if (parts[0] === null) return [null, null];
    return [parts[0], parts[1] ?? null];
  };

  // === Nuevo: formatear RIR desde [min, max] a string ===
  const formatRIR = (min?: number | null, max?: number | null): string => {
    if (min === null || min === undefined) return "";
    if (max === null || max === undefined) return min.toString();
    return `${min}-${max}`;
  };

  // === Nuevo: validar RIR (min requerido, max <= min) ===
  const isValidRIR = (min?: number | null, max?: number | null): boolean => {
    if (min === null || min === undefined) return false;
    if (max === null || max === undefined) return true; // max opcional
    return max <= min;
  };

  // Helper para actualizar notas de ejercicio
  const setExerciseNote = (exerciseId: string | undefined, note: string) => {
    if (!exerciseId) return;
    setExerciseNotes((prev) => ({
      ...prev,
      [exerciseId]: note.trim() || undefined,
    }));
    // Sincronizar con logs también
    const k = keyFor(exerciseId);
    const entry = ensureEntry(k);
    setLogs((prev) => ({
      ...prev,
      [k]: { ...entry, notes: note.trim() || undefined },
    }));
  };

  const getExerciseNote = (exerciseId: string | undefined): string => {
    if (!exerciseId) return "";
    return exerciseNotes[exerciseId] ?? "";
  };

  // Cargar datos desde IndexedDB al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        const historyData = await getFromDB(STORAGE_HISTORY);
        const currentData = await getFromDB(STORAGE_CURRENT);

        if (historyData) setHistory(historyData);
        if (currentData) {
          setDone(currentData.done || {});
          // Migración: asegurar que cada entry tiene notes
          const migratedLogs = currentData.logs || {};
          Object.keys(migratedLogs).forEach((k) => {
            if (!migratedLogs[k].notes) {
              migratedLogs[k].notes = undefined;
            }
          });
          setLogs(migratedLogs);

          // Cargar bodyWeight si existe
          if (currentData.bodyWeight) {
            setBodyWeight(currentData.bodyWeight.toString());
          }

          // Cargar exerciseNotes desde logs
          const loadedNotes: Record<string, string> = {};
          Object.keys(migratedLogs).forEach((k) => {
            const notes = migratedLogs[k].notes;
            if (notes && notes.trim()) {
              // Extraer el exerciseId de la clave (formato: "dia:exerciseId")
              const exerciseId = k.split(":")[1];
              if (exerciseId) {
                loadedNotes[exerciseId] = notes;
              }
            }
          });
          setExerciseNotes(loadedNotes);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto-focus y cálculo de sugerencias cuando se abre el selector
  useEffect(() => {
    if (selectorOpen.open) {
      // small timeout to ensure input is mounted
      setTimeout(() => searchInputRef.current?.focus(), 60);
      setSearchTerm(""); // empezar limpio
      const byGroup = ejerciciosDB.filter(
        (ej) => ej.grupo === selectorOpen.grupo
      );
      setSuggestions(byGroup.slice(0, 8));
    } else {
      setSuggestions([]);
      setSearchTerm("");
    }
  }, [selectorOpen]);

  // Actualizar sugerencias cuando cambia el término de búsqueda
  useEffect(() => {
    if (!selectorOpen.open) return;
    const term = (searchTerm || "").trim();
    let results: Ejercicio[] = [];
    if (term === "") {
      results = ejerciciosDB.filter((ej) => ej.grupo === selectorOpen.grupo);
    } else {
      results = buscarEjercicios(term);
    }
    // Priorizar mismo grupo si target tiene grupo
    if (selectorOpen.grupo) {
      results = results.sort((a, b) =>
        a.grupo === selectorOpen.grupo ? -1 : 1
      );
    }
    setSuggestions(results.slice(0, 12));
  }, [searchTerm, selectorOpen]);

  useEffect(() => {
    localStorage.setItem("rg-selectedDay", selectedDay);
  }, [selectedDay]);

  // Guardar historial en IndexedDB
  useEffect(() => {
    if (!isLoading && history.length > 0) {
      saveToDB(STORAGE_HISTORY, history);
    }
  }, [history, isLoading]);

  // Guardar sesión actual en IndexedDB (MODIFICADO: incluir bodyWeight)
  useEffect(() => {
    if (!isLoading) {
      const bodyWeightNum = parseFloat(bodyWeight || "0");
      saveToDB(STORAGE_CURRENT, {
        done,
        logs,
        bodyWeight: bodyWeightNum > 0 ? bodyWeightNum : undefined,
      });
    }
  }, [done, logs, bodyWeight, isLoading]);

  // =======================
  // RUTINA EDITABLE (estado persistido)
  // =======================
  // Inicializar desde IndexedDB si existe, si no desde la constante `rutina`
  const [rutinaState, setRutinaState] = useState<typeof rutina>(() => {
    return Object.fromEntries(
      dias.map((d) => [d, withIds(rutina[d], d)])
    ) as typeof rutina;
  });

  // Cargar rutina persistida al montar (si hay)
  useEffect(() => {
    const loadRutina = async () => {
      try {
        const stored = await getFromDB(STORAGE_RUTINA);
        if (stored) {
          setRutinaState(stored);
        }
      } catch (err) {
        console.error("Error cargando rutina desde DB:", err);
      }
    };
    loadRutina();
  }, []);

  // Guardar rutina cada vez que cambia
  useEffect(() => {
    saveToDB(STORAGE_RUTINA, rutinaState).catch((e) => console.error(e));
  }, [rutinaState]);

  // =======================
  // Helpers para modificar la rutina (add / remove / update / move)
  // =======================
  const updateExercise = (
    day: keyof typeof rutinaState,
    ejId: string,
    patch: Partial<Ejercicio>
  ) => {
    setRutinaState((prev) => {
      const copy = { ...prev };
      copy[day] = {
        ...copy[day],
        ejercicios: copy[day].ejercicios.map((ej) =>
          ej.id === ejId ? { ...ej, ...patch } : ej
        ),
      };
      return copy;
    });
  };

  const addExercise = (day: keyof typeof rutinaState, ejercicio: Ejercicio) => {
    setRutinaState((prev) => {
      const copy = { ...prev };
      const newId = `${day}-E${Date.now().toString(36)}`;
      copy[day] = {
        ...copy[day],
        ejercicios: [...copy[day].ejercicios, { ...ejercicio, id: newId }],
      };
      return copy;
    });
  };

  const removeExercise = (day: keyof typeof rutinaState, ejId: string) => {
    // limpiar logs/done relacionados
    setDone((d) => {
      const copy = { ...d };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${day}:`) && k.includes(ejId)) delete copy[k];
      });
      return copy;
    });
    setLogs((l) => {
      const copy = { ...l };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${day}:`) && k.includes(ejId)) delete copy[k];
      });
      return copy;
    });

    setRutinaState((prev) => {
      const copy = { ...prev };
      copy[day] = {
        ...copy[day],
        ejercicios: copy[day].ejercicios.filter((e) => e.id !== ejId),
      };
      return copy;
    });
  };

  const moveExercise = (
    day: keyof typeof rutinaState,
    ejId: string,
    dir: "up" | "down"
  ) => {
    setRutinaState((prev) => {
      const copy = { ...prev };
      const arr = copy[day].ejercicios.slice();
      const idx = arr.findIndex((e) => e.id === ejId);
      if (idx === -1) return prev;
      const swapWith = dir === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= arr.length) return prev;
      const tmp = arr[swapWith];
      arr[swapWith] = arr[idx];
      arr[idx] = tmp;
      copy[day] = { ...copy[day], ejercicios: arr };
      return copy;
    });
  };

  // =======================
  // Cuando se selecciona una sugerencia en el selector (aplica metadata automáticamente)
  // =======================
  const handleSelectSuggestion = (sug: Ejercicio) => {
    if (!selectorOpen.open) return;
    // Modo "add": agrega el ejercicio completo a la rutina del día seleccionado
    if (selectorOpen.mode === "add") {
      addExercise(selectedDay, { ...sug, id: undefined });
      setSelectorOpen({ open: false });
      return;
    }

    // Modo "replace": reemplaza metadata y nombre (alt) del ejercicio objetivo
    if (selectorOpen.mode === "replace" && selectorOpen.targetId) {
      updateExercise(selectedDay, selectorOpen.targetId, {
        nombre: sug.nombre,
        series: sug.series,
        reps: sug.reps,
        rpe: sug.rpe,
        tempo: sug.tempo,
        nota: sug.nota,
        grupo: sug.grupo,
      });
      // actualizar nombre alternativo en logs para consistencia con lo mostrado
      setAltName(selectorOpen.targetId, sug.nombre);
      setSelectorOpen({ open: false });
      return;
    }

    // Fallback: cerrar selector
    setSelectorOpen({ open: false });
  };

  // Reemplazar uso de rutinaConIds por rutinaState en todo el componente

  // Pre-cargar valores de última sesión del mismo día
  useEffect(() => {
    if (isLoading) return;

    const lastSession = history
      .filter((s) => s.day === selectedDay)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

    if (lastSession && Object.keys(logs).length === 0) {
      // Migrar las claves de session.exercises (que están guardadas como ej.id)
      // a las claves que usa `logs` (formato: "dia:ejId")
      const migrated = Object.fromEntries(
        Object.entries(lastSession.exercises).map(([exId, exData]) => [
          `${lastSession.day}:${exId}`,
          exData,
        ])
      );
      setLogs(migrated as any);
    }
  }, [selectedDay, isLoading, history]);

  const previousSession = useMemo(() => {
    return history
      .filter((s) => s.day === selectedDay)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
  }, [history, selectedDay]);

  const volumenSemanal = useMemo(() => {
    const acc = new Map<Grupo, { min: number; max: number }>();
    dias.forEach((d) => {
      rutinaState[d].ejercicios.forEach((e) => {
        const [minS, maxS] = seriesToRange(e.series);
        const cur = acc.get(e.grupo) || { min: 0, max: 0 };
        acc.set(e.grupo, { min: cur.min + minS, max: cur.max + maxS });
      });
    });
    return acc;
  }, [rutinaState]);

  const exportToCSV = () => {
    let csv =
      "DÍA,EJERCICIO,SERIES,REPS OBJETIVO,RPE,TEMPO,NOTAS,GRUPO MUSCULAR\n";

    dias.forEach((dia) => {
      const data = rutinaState[dia];
      csv += `\n${data.nombre}\n`;
      data.ejercicios.forEach((ej) => {
        csv += `${dia.toUpperCase()},${ej.nombre.replace(/,/g, " ")},${
          ej.series
        },${ej.reps},${ej.rpe},${ej.tempo || "-"},${ej.nota || "-"},${
          ej.grupo
        }\n`;
      });
    });

    csv += "\n\nABDOMINALES (día intercalado)\n";
    abdominales.forEach((ab) => {
      csv += `OPCIONAL,${ab.nombre.replace(/,/g, " ")},${ab.series},${
        ab.reps
      },${ab.rpe},-,-,abdominales\n`;
    });

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rutina_hipertrofia.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // --- TSV para Google Sheets: 1ª fila = Fecha + Día + (peso en col E),
  // luego ejercicios debajo del Día (col B). Sin encabezados.
  const sanitizeTSV = (v: any): string => {
    if (v === null || v === undefined) return "";
    return String(v).replace(/\t/g, " ").replace(/\r?\n/g, " / ").trim();
  };

  const asRIR = (v: any): string => {
    const raw = sanitizeTSV(v);
    return raw === "" ? "-" : raw;
  };

  const generarTablaParaSheets = (): string => {
    const fechaStr = new Date().toISOString().split("T")[0];
    let tsv = "";

    // Fila 1 — A: Fecha | B: Día/Grupo | C: (vacío) | D: (vacío) | E: Peso | F: (vacío)
    const pesoStr = bodyWeight ? sanitizeTSV(bodyWeight) : "";
    tsv += `${fechaStr}\t${sanitizeTSV(day.nombre)}\t\t\t${pesoStr}\t\n`;

    // Filas siguientes — A: (vacío) | B: Ejercicio | C: Reps | D: RIR | E: (vacío) | F: Notas
    day.ejercicios.forEach((ej) => {
      const k = keyFor(ej.id);
      const entry = logs[k];
      const sets = Array.isArray(entry?.sets) ? entry!.sets : [];

      const repsList = sets.map((s) => sanitizeTSV(s.reps)).join(",");
      const rirsList = sets.map((s) => asRIR(s.rir)).join(",");
      const nota = sanitizeTSV(getExerciseNote(ej.id) || entry?.notes || "");

      // Anteponemos tab para dejar la col A vacía y alinear bajo la col B (Día)
      tsv += `\t${sanitizeTSV(
        displayName(ej)
      )}\t'${repsList}\t'${rirsList}\t\t${nota}\n`;
    });

    return tsv;
  };

  // Copiar día completo (resumen legible para compartir)
  const copiarDiaCompleto = async () => {
    const lines: string[] = [];
    const hoy = new Date();
    lines.push(`🏋️ ${day.nombre}`);
    lines.push(`📅 ${hoy.toLocaleDateString("es-AR")}`);
    lines.push("");

    day.ejercicios.forEach((ej, i) => {
      const idx = i + 1;
      lines.push(`${idx}. ${ej.nombre}`);
      lines.push(
        `   Series: ${ej.series} | Reps objetivo: ${ej.reps} | RPE: ${ej.rpe}`
      );
      if (ej.tempo) lines.push(`   Tempo: ${ej.tempo}`);
      if (ej.nota) lines.push(`   💡 ${ej.nota}`);

      const sets = filledSets(ej.id, ej.series);
      if (sets.length > 0) {
        lines.push(`   📊 Series realizadas:`);
        sets.forEach((s, si) => {
          const peso = (s.peso ?? "").toString().trim() || "0";
          const reps = (s.reps ?? "").toString().trim() || "0";
          lines.push(`      ${si + 1}. ${peso} kg × ${reps} reps`);
        });
      } else {
        lines.push(`   📊 Series realizadas: —`);
      }

      lines.push(`   ✅ Completado: ${isDone(ej.id) ? "SÍ" : "NO"}`);
      lines.push("");
    });

    lines.push("📈 Resumen del día:");
    lines.push(
      `   Ejercicios completados: ${completedCount}/${day.ejercicios.length}`
    );
    lines.push(`   Volumen total: ${currentVolume} kg`);
    lines.push("");
    lines.push("📝 Notas del entrenamiento:");
    lines.push("____________________________");
    lines.push("");
    lines.push("🎯 Técnica: _______");
    lines.push("");
    lines.push("✨ Puntos a mejorar:");
    lines.push("____________________________");

    const texto = lines.join("\n");

    try {
      await navigator.clipboard.writeText(texto);
      alert("✅ Día copiado al portapapeles. Pegalo donde quieras.");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Día copiado (fallback).");
    }
  };

  const day = rutinaState[selectedDay];

  const keyFor = (id?: string) => `${selectedDay}:${id ?? ""}`;
  const isDone = (id?: string) => !!done[keyFor(id)];
  const toggleDone = (id?: string) =>
    setDone((d) => ({ ...d, [keyFor(id)]: !isDone(id) }));

  const resetDay = () => {
    setDone((d) => {
      const copy = { ...d } as Record<string, boolean>;
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${selectedDay}:`)) delete copy[k];
      });
      return copy;
    });
    setLogs((prev) => {
      const copy: typeof prev = { ...prev };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${selectedDay}:`)) delete copy[k];
      });
      return copy;
    });
    // Limpiar notas del día
    setExerciseNotes((prev) => {
      const copy = { ...prev };
      day.ejercicios.forEach((ej) => {
        if (ej.id) delete copy[ej.id];
      });
      return copy;
    });
    // Limpiar peso corporal
    setBodyWeight("");
  };

  const finalizarSesion = () => {
    const exercises: Record<string, SessionExercise> = {};
    let totalVolume = 0;

    day.ejercicios.forEach((ej) => {
      const k = keyFor(ej.id);
      const entry = logs[k];
      const sets = (entry?.sets ?? []).filter(isFilled);

      exercises[ej.id!] = {
        sets: sets,
        alt: entry?.alt,
        notes: entry?.notes, // NUEVO
        completed: isDone(ej.id),
      };

      sets.forEach((s) => {
        const peso = parseFloat(s.peso || "0");
        const reps = parseFloat(s.reps || "0");
        totalVolume += peso * reps;
      });
    });

    const duration = Math.round((Date.now() - sessionStartTime) / 60000);

    // Parsear bodyWeight
    const bodyWeightNum = parseFloat(bodyWeight || "0");

    const newSession: WorkoutSession = {
      date: new Date().toISOString(),
      day: selectedDay,
      exercises,
      totalVolume: Math.round(totalVolume),
      bodyWeight: bodyWeightNum > 0 ? bodyWeightNum : undefined, // NUEVO
      duration,
    };

    setHistory((prev) => [newSession, ...prev]);
    resetDay();

    alert(
      `✅ Sesión guardada!\n\nVolumen total: ${Math.round(
        totalVolume
      )} kg\nDuración: ${duration} min${
        bodyWeightNum > 0 ? `\nPeso corporal: ${bodyWeightNum} kg` : ""
      }`
    );
  };

  const minSeriesFrom = (series: Series): number => {
    if (typeof series === "number") return series;
    const [min] = seriesToRange(series);
    return min;
  };

  const getSets = (id: string | undefined, _series: Series) => {
    const k = keyFor(id);
    const entry = logs[k];
    const sets = entry?.sets ?? [];
    if (sets.length > 0) return sets;

    // Siempre 1 set vacío por defecto
    return [{ peso: "", reps: "", rir: "" }];
  };

  const ensureEntry = (k: string) => {
    const e = logs[k];
    if (!e) {
      const created = {
        sets: [] as Array<{ peso?: string; reps?: string; rir?: string }>,
        alt: undefined as string | undefined,
        notes: undefined as string | undefined, // NUEVO
      };
      setLogs((prev) => ({ ...prev, [k]: created }));
      return created;
    }
    const neo = {
      sets: e.sets ?? [],
      alt: e.alt,
      notes: e.notes, // NUEVO
    } as {
      sets: Array<{ peso?: string; reps?: string; rir?: string }>;
      alt?: string;
      notes?: string; // NUEVO
    };
    if (neo !== e) setLogs((prev) => ({ ...prev, [k]: neo }));
    return neo;
  };

  const setSetValue = (
    id: string | undefined,
    idx: number,
    field: "peso" | "reps" | "rirMin" | "rirMax",
    value: string
  ) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const current = (entry.sets ?? []).slice();
    while (current.length <= idx) current.push({ peso: "", reps: "", rir: "" });

    const set = current[idx];

    if (field === "peso" || field === "reps") {
      current[idx] = { ...set, [field]: value };
    } else if (field === "rirMin") {
      const minVal = value.trim() === "" ? null : parseInt(value, 10);
      const [, maxVal] = parseRIR(set.rir);
      if (minVal !== null && !Number.isFinite(minVal)) return; // rechazar inválido
      current[idx] = { ...set, rir: formatRIR(minVal, maxVal) };
    } else if (field === "rirMax") {
      const [minVal] = parseRIR(set.rir);
      const maxVal = value.trim() === "" ? null : parseInt(value, 10);
      if (maxVal !== null && !Number.isFinite(maxVal)) return; // rechazar inválido
      current[idx] = { ...set, rir: formatRIR(minVal, maxVal) };
    }

    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
  };

  const addSet = (id: string | undefined) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const current = (entry.sets ?? []).slice();
    current.push({ peso: "", reps: "", rir: "" });
    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
  };

  const removeSet = (id: string | undefined, idx: number) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const current = (entry.sets ?? []).slice();
    if (current.length === 0) return;
    current.splice(idx, 1);
    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
  };

  const isFilled = (s?: { peso?: string; reps?: string }) =>
    !!s &&
    (s.peso ?? "").toString().trim() !== "" &&
    (s.reps ?? "").toString().trim() !== "";

  const filledSets = (id: string | undefined, series: Series) =>
    getSets(id, series).filter(isFilled);

  const duplicateLastSet = (id: string | undefined) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const current = (entry.sets ?? []).slice();
    const last =
      current.length > 0
        ? current[current.length - 1]
        : { peso: "", reps: "", rir: "" };
    current.push({
      peso: last.peso ?? "",
      reps: last.reps ?? "",
      rir: last.rir ?? "",
    });
    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
  };

  const clearEmptySets = (id: string | undefined, _series: Series) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    let current = (entry.sets ?? []).slice();
    current = current.filter((s) => isFilled(s));

    // Si todas estaban vacías, dejamos exactamente 1 fila vacía
    if (current.length === 0) {
      current = [{ peso: "", reps: "", rir: "" }];
    }

    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
  };

  const setAltName = (id: string | undefined, alt: string | undefined) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const clean = (alt ?? "").trim();
    setLogs((prev) => ({
      ...prev,
      [k]: { ...entry, alt: clean || undefined },
    }));
  };

  const displayName = (ej: Ejercicio) => {
    const k = keyFor(ej.id);
    const entry = logs[k] as any;
    const alt = entry && "alt" in entry ? entry.alt : undefined;
    return alt && alt.trim() ? alt.trim() : ej.nombre;
  };

  const completedCount = day.ejercicios.reduce(
    (acc, e) => acc + (isDone(e.id) ? 1 : 0),
    0
  );

  const currentVolume = useMemo(() => {
    let total = 0;
    day.ejercicios.forEach((ej) => {
      const sets = filledSets(ej.id, ej.series);
      sets.forEach((s) => {
        const peso = parseFloat(s.peso || "0");
        const reps = parseFloat(s.reps || "0");
        total += peso * reps;
      });
    });
    return Math.round(total);
  }, [logs, selectedDay, day.ejercicios]);

  const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mostrar loading mientras carga desde IndexedDB
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando datos... 💪</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 md:p-6 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto">
        {/* Header compacto */}
        <div className="bg-slate-800 rounded-lg shadow-xl p-2 md:p-4 mb-2 border border-slate-700 print:shadow-none print:border-0 print:bg-white">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white print:text-slate-900">
                  💪 Rutina Hipertrofia
                </h1>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 text-[11px] rounded transition print:hidden"
                >
                  📊 ({history.length})
                </button>
                <button
                  onClick={copiarDiaCompleto}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 text-xs rounded transition print:hidden"
                  title="Copiar día"
                >
                  📋 Copiar día
                </button>
                <button
                  onClick={async () => {
                    const tabla = generarTablaParaSheets();
                    try {
                      await navigator.clipboard.writeText(tabla);
                      alert(
                        "✅ Tabla copiada — pegá en Google Sheets (Ctrl/Cmd+V)"
                      );
                    } catch {
                      // Fallback iOS / permisos
                      const ta = document.createElement("textarea");
                      ta.value = tabla;
                      document.body.appendChild(ta);
                      ta.select();
                      document.execCommand("copy");
                      document.body.removeChild(ta);
                      alert(
                        "✅ Tabla copiada (fallback) — pegá en Google Sheets"
                      );
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs rounded transition print:hidden"
                  title="Copiar tabla TSV para Sheets"
                >
                  📑 Exportar Tabla
                </button>
              </div>
            </div>

            {/* Botones colapsables */}
            <div className="flex gap-2 text-xs print:hidden">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="text-slate-300 hover:text-white underline"
              >
                {showLegend ? "Ocultar" : "Ver"} colores
              </button>
              <button
                onClick={() => setShowVolumenSemanal(!showVolumenSemanal)}
                className="text-slate-300 hover:text-white underline"
              >
                {showVolumenSemanal ? "Ocultar" : "Ver"} volumen semanal
              </button>
            </div>

            {/* Leyenda colapsable */}
            {showLegend && (
              <div className="bg-slate-700 rounded p-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                  {Object.entries(colorLegend).map(([key, value]) => (
                    <div
                      key={key}
                      className={`${value.bg} ${value.border} border rounded px-2 py-0.5 text-center text-xs`}
                    >
                      <span className={`${value.text} font-medium capitalize`}>
                        {key}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Volumen semanal colapsable */}
            {showVolumenSemanal && (
              <div className="bg-slate-700 rounded p-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[...volumenSemanal.entries()].map(
                    ([grupo, { min, max }]) => (
                      <div
                        key={grupo}
                        className={`rounded p-2 border text-xs ${colorLegend[grupo].border} ${colorLegend[grupo].bg}`}
                      >
                        <div
                          className={`font-semibold ${colorLegend[grupo].text} capitalize`}
                        >
                          {grupo}
                        </div>
                        <div className="text-slate-700 font-mono text-xs">
                          {min === max ? min : `${min}–${max}`} series
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selector de días */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-2 print:hidden">
          {dias.map((dia) => (
            <button
              key={dia}
              onClick={() => setSelectedDay(dia)}
              className={`px-3 py-2 rounded text-sm font-semibold transition whitespace-nowrap ${
                selectedDay === dia
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {dia.charAt(0).toUpperCase() + dia.slice(1)}
            </button>
          ))}
        </div>
        {/* STATUS BAR — mobile-first + sticky */}
        <div
          className="sticky top-[calc(env(safe-area-inset-top)+8px)] z-30 print:hidden"
          style={{
            WebkitBackdropFilter: "blur(6px)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div className="bg-slate-800/85 border border-slate-700 rounded-lg px-2 py-1.5 mb-3 overflow-x-auto no-scrollbar">
            {/* Línea única (iPhone): chips desplazables */}
            <div className="flex items-center gap-2 whitespace-nowrap md:hidden">
              {/* Peso corporal */}
              <div className="flex items-center gap-1 bg-slate-700 rounded px-2 py-1">
                <span className="text-xs text-slate-300">⚖️</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(e.target.value)}
                  placeholder="kg"
                  className="w-16 text-xs font-semibold bg-transparent outline-none text-slate-100 placeholder:text-slate-400"
                />
              </div>

              {/* En curso */}
              <div className="flex items-center gap-1 bg-emerald-800/70 rounded px-2 py-1">
                <span className="text-xs">
                  🟢 {new Date().toLocaleDateString("es-AR")}
                </span>
                <span className="text-[10px] bg-emerald-900/70 rounded px-1 py-[2px] text-white font-mono">
                  {completedCount}/{day.ejercicios.length}
                </span>
                <span className="text-xs font-semibold">
                  {currentVolume} kg
                </span>
                <span className="text-xs">{elapsedMin} min</span>
              </div>

              {/* Última sesión (si existe) */}
              {previousSession && (
                <div className="flex items-center gap-1 bg-slate-700 rounded px-2 py-1">
                  <span className="text-xs">
                    🔄 {formatDate(previousSession.date).split(",")[0]}
                  </span>
                  <span className="text-xs font-semibold">
                    {previousSession.totalVolume} kg
                  </span>
                  <span className="text-xs">
                    {previousSession.duration ?? "–"} min
                  </span>
                </div>
              )}
            </div>

            {/* Layout para md+ (se muestra en iPad/desktop) */}
            <div className="hidden md:grid md:grid-cols-3 md:items-center md:gap-2 text-xs">
              {/* Col 1: peso */}
              <div className="flex items-center gap-2">
                <span className="text-slate-300">⚖️ Peso corporal</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(e.target.value)}
                  placeholder="kg"
                  className="w-20 px-2 py-1 rounded bg-white/90 text-slate-800 text-xs font-semibold"
                />
                {bodyWeight && (
                  <span className="text-[10px] text-slate-400">
                    ✓ al finalizar
                  </span>
                )}
              </div>

              {/* Col 2: en curso */}
              <div className="flex items-center gap-3 justify-center">
                <span>🟢 {new Date().toLocaleDateString("es-AR")}</span>
                <span className="px-2 py-0.5 rounded bg-slate-700 text-white font-mono">
                  {completedCount}/{day.ejercicios.length}
                </span>
                <span className="font-semibold">{currentVolume} kg</span>
                <span>{elapsedMin} min</span>
              </div>

              {/* Col 3: última sesión */}
              <div className="flex items-center gap-3 justify-end text-slate-300">
                {previousSession ? (
                  <>
                    <span>
                      🔄 {formatDate(previousSession.date).split(",")[0]}
                    </span>
                    <span className="font-semibold">
                      {previousSession.totalVolume} kg
                    </span>
                    <span>{previousSession.duration ?? "–"} min</span>
                  </>
                ) : (
                  <span className="text-slate-500">Sin sesiones previas</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Historial - ACTUALIZADO con bodyWeight */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  📊 Historial de Entrenamientos
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-white hover:text-slate-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              {history.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Aún no hay sesiones guardadas. Completa tu primer
                  entrenamiento!
                </p>
              ) : (
                <div className="space-y-4">
                  {history.map((session, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white capitalize">
                            {session.day} - {formatDate(session.date)}
                          </h3>
                          <div className="flex gap-4 mt-1 text-sm text-slate-300 flex-wrap">
                            <span>💪 Volumen: {session.totalVolume} kg</span>
                            {session.duration && (
                              <span>⏱️ {session.duration} min</span>
                            )}
                            {session.bodyWeight && (
                              <span>⚖️ {session.bodyWeight} kg</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2 text-sm">
                        {Object.entries(session.exercises).map(
                          ([exId, exData]) => {
                            const originalEx = rutinaState[
                              session.day
                            ].ejercicios.find((e) => e.id === exId);
                            if (!originalEx) return null;

                            const displayEx = exData.alt || originalEx.nombre;
                            const setsStr = exData.sets
                              .map((s) => {
                                const rir = s.rir ? ` (${s.rir})` : "";
                                return `${s.peso}×${s.reps}${rir}`;
                              })
                              .join(" | ");

                            return (
                              <div
                                key={exId}
                                className={`p-2 rounded ${
                                  exData.completed
                                    ? "bg-slate-600"
                                    : "bg-slate-700/50"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span
                                      className={
                                        exData.completed
                                          ? "text-white"
                                          : "text-slate-400"
                                      }
                                    >
                                      {exData.completed ? "✓" : "○"} {displayEx}
                                    </span>
                                    <span className="text-slate-300 ml-2 font-mono text-xs">
                                      {setsStr || "—"}
                                    </span>
                                  </div>
                                  {exData.notes && (
                                    <span className="text-slate-300 text-xs ml-2 italic">
                                      📝 {exData.notes}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabla de ejercicios - COMPACTA */}
        <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700 print:border-0 print:shadow-none print:bg-white mb-2">
          <div className="bg-slate-700 p-2 border-b border-slate-600 print:bg-white print:border-b">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-sm md:text-base font-bold text-white print:text-slate-900">
                {day.nombre}
              </h2>
              <div className="flex items-center gap-1 print:hidden text-xs">
                <span className="bg-emerald-700 text-white px-2 py-0.5 rounded font-semibold">
                  {currentVolume} kg
                </span>
                <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded">
                  {completedCount}/{day.ejercicios.length}
                </span>
                <button
                  onClick={finalizarSesion}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold"
                >
                  ✓ Fin
                </button>
                <button
                  onClick={resetDay}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-2 py-0.5 rounded"
                >
                  Reset
                </button>
                <button
                  onClick={() =>
                    setSelectorOpen({
                      open: true,
                      mode: "add",
                      grupo: undefined,
                    })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded"
                >
                  + Agregar ejercicio
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs" role="table">
              <thead className="bg-slate-700 print:bg-slate-100">
                <tr>
                  <th className="px-2 py-2 text-left text-slate-300 print:text-slate-800">
                    ✓
                  </th>
                  <th className="px-2 py-2 text-left text-slate-300 print:text-slate-800 sticky left-0 bg-slate-700 z-10">
                    Ejercicio
                  </th>
                  <th className="px-2 py-2 text-center text-slate-300 print:text-slate-800">
                    S
                  </th>
                  <th className="px-2 py-2 text-center text-slate-300 print:text-slate-800">
                    Reps
                  </th>
                  <th className="px-2 py-2 text-left text-slate-300 print:text-slate-800">
                    reps × kg × RIR
                  </th>
                  <th className="px-2 py-2 text-center text-slate-300 print:text-slate-800">
                    RPE
                  </th>
                </tr>
              </thead>
              <tbody>
                {day.ejercicios.map((ej, idx) => {
                  const colors = colorLegend[ej.grupo];
                  const checked = isDone(ej.id);
                  return (
                    <tr
                      key={ej.id}
                      className={`${colors.bg} border-b ${colors.border}`}
                    >
                      <td className="px-2 py-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDone(ej.id)}
                          className="w-4 h-4"
                        />
                      </td>

                      <td
                        className={`px-2 py-2 font-semibold ${colors.text} sticky left-0 ${colors.bg} z-10`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[10px] text-slate-600">
                              E{idx + 1}
                            </span>
                            <span className="text-[11px] leading-tight">
                              {displayName(ej)}
                            </span>
                          </div>
                          {previousSession?.exercises[ej.id!] && (
                            <div className="text-[10px] text-slate-500">
                              ←{" "}
                              {previousSession.exercises[ej.id!].sets
                                .map((s) => `${s.peso}×${s.reps}`)
                                .join(" ")}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectorOpen({
                                open: true,
                                targetId: ej.id,
                                grupo: ej.grupo,
                                mode: "replace",
                              });
                            }}
                            className="text-[10px] px-1 rounded border border-slate-400 hover:bg-slate-200 text-slate-700 bg-white/70 w-fit"
                          >
                            Reemplazar
                          </button>

                          <div className="flex gap-1 mt-1">
                            <button
                              onClick={() =>
                                moveExercise(selectedDay, ej.id!, "up")
                              }
                              className="text-[10px] px-1 rounded border border-slate-400 hover:bg-slate-200 bg-white/70"
                              title="Mover arriba"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() =>
                                moveExercise(selectedDay, ej.id!, "down")
                              }
                              className="text-[10px] px-1 rounded border border-slate-400 hover:bg-slate-200 bg-white/70"
                              title="Mover abajo"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  !confirm("Eliminar ejercicio de la rutina?")
                                )
                                  return;
                                removeExercise(selectedDay, ej.id!);
                              }}
                              className="text-[10px] px-1 rounded border border-red-400 hover:bg-red-600 text-red-700 bg-white/70"
                              title="Eliminar ejercicio"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="px-2 py-2 text-center font-bold text-slate-700 text-[11px]">
                        {ej.series}
                      </td>
                      <td className="px-2 py-2 text-center font-mono text-slate-700 text-[10px]">
                        {ej.reps}
                      </td>

                      <td className="px-2 py-2">
                        <div className="flex flex-col gap-1">
                          {getSets(ej.id, ej.series).map((s, sidx) => {
                            const [rirMin, rirMax] = parseRIR(s.rir);
                            return (
                              <div
                                key={sidx}
                                className="flex items-center gap-0.5 flex-wrap"
                              >
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  placeholder="r"
                                  value={s.reps ?? ""}
                                  onChange={(e) =>
                                    setSetValue(
                                      ej.id,
                                      sidx,
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                  className="w-10 text-center px-1 py-0.5 text-xs rounded border border-slate-400 bg-white/70"
                                />

                                <span className="text-slate-600 text-xs">
                                  ×
                                </span>

                                <input
                                  type="number"
                                  inputMode="decimal"
                                  placeholder="kg"
                                  value={s.peso ?? ""}
                                  onChange={(e) =>
                                    setSetValue(
                                      ej.id,
                                      sidx,
                                      "peso",
                                      e.target.value
                                    )
                                  }
                                  className="w-12 text-center px-1 py-0.5 text-xs rounded border border-slate-400 bg-white/70"
                                />

                                <span className="text-slate-600 text-xs">
                                  ×
                                </span>

                                <input
                                  type="number"
                                  inputMode="numeric"
                                  placeholder="RIR"
                                  value={rirMin ?? ""}
                                  onChange={(e) =>
                                    setSetValue(
                                      ej.id,
                                      sidx,
                                      "rirMin",
                                      e.target.value
                                    )
                                  }
                                  className="w-10 text-center px-1 py-0.5 text-xs rounded border border-slate-400 bg-white/70"
                                  title="RIR Mínimo (requerido)"
                                />

                                <span className="text-slate-600 text-xs">
                                  −
                                </span>

                                <input
                                  type="number"
                                  inputMode="numeric"
                                  placeholder="RIR"
                                  value={rirMax ?? ""}
                                  onChange={(e) =>
                                    setSetValue(
                                      ej.id,
                                      sidx,
                                      "rirMax",
                                      e.target.value
                                    )
                                  }
                                  className="w-10 text-center px-1 py-0.5 text-xs rounded border border-slate-400 bg-white/70"
                                  title="RIR Máximo (opcional)"
                                />

                                <button
                                  type="button"
                                  onClick={() => removeSet(ej.id, sidx)}
                                  className="px-1 text-xs rounded border border-slate-400 hover:bg-slate-200"
                                >
                                  −
                                </button>
                              </div>
                            );
                          })}

                          <div className="flex gap-0.5 mt-1 flex-wrap">
                            <button
                              onClick={() => addSet(ej.id)}
                              className="px-1 text-[10px] rounded border border-slate-400 hover:bg-slate-200"
                            >
                              ➕ Agregar serie
                            </button>
                            <button
                              onClick={() => duplicateLastSet(ej.id)}
                              className="px-1 text-[10px] rounded border border-slate-400 hover:bg-slate-200"
                            >
                              📝 Duplicar última
                            </button>
                            <button
                              onClick={() => clearEmptySets(ej.id, ej.series)}
                              className="px-1 text-[10px] rounded border border-slate-400 hover:bg-slate-200"
                            >
                              🗑️ Limpiar vacías
                            </button>
                            <button
                              onClick={() => openOneRMFor(ej.id)}
                              className="px-2 text-[11px] rounded border border-slate-400 hover:bg-slate-200 bg-white/70"
                              title="Calcular 1RM (Epley)"
                            >
                              🧮 1RM
                            </button>
                          </div>

                          {/* NUEVO: Textarea de notas por ejercicio - ACTUALIZADO */}
                          <div className="mt-2 print:hidden">
                            <textarea
                              value={getExerciseNote(ej.id)}
                              onChange={(e) =>
                                setExerciseNote(ej.id, e.target.value)
                              }
                              placeholder="📝 Notas..."
                              rows={2}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-400 bg-white/70 text-slate-800 resize-none"
                            />
                            {getExerciseNote(ej.id) && (
                              <div className="text-xs text-slate-500 mt-0.5">
                                ✓ Guardada en logs
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-2 py-2 text-center font-bold text-slate-700 text-[11px]">
                        {ej.rpe}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Abdominales - compacto */}
        <div className="bg-slate-800 rounded-lg p-3 mb-3 border border-slate-700 print:bg-white">
          <h3 className="text-sm font-bold text-white mb-2 print:text-slate-900">
            🔥 Abdominales (opcional)
          </h3>
          <div className="grid md:grid-cols-3 gap-2 text-xs">
            {abdominales.map((ab, idx) => (
              <div
                key={idx}
                className="bg-slate-700 rounded p-2 border-l-2 border-indigo-500 print:bg-white"
              >
                <h4 className="font-semibold text-white mb-1 print:text-slate-900 text-[11px]">
                  {ab.nombre}
                </h4>
                <div className="text-slate-300 print:text-slate-800 text-[10px]">
                  {ab.series} × {ab.reps} | RPE {ab.rpe}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas técnicas - colapsable */}
        <details className="bg-slate-800 rounded-lg p-3 border border-slate-700 print:bg-white">
          <summary className="text-sm font-bold text-white cursor-pointer print:text-slate-900">
            📋 Notas Técnicas (click para expandir)
          </summary>
          <div className="grid md:grid-cols-2 gap-3 text-slate-300 print:text-slate-800 mt-3 text-xs">
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                Progresión de Reps
              </h4>
              <p>
                8-10 / 9-11 / 10-12 = progresión semanal. Al completar semana 3,
                subir peso y volver a 8-10.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                Back-off Sets
              </h4>
              <p>
                Reducir ~10% el peso en las series finales para mantener calidad
                técnica.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                Tempo (ej: 1-0-3-1)
              </h4>
              <p>
                1s excéntrico – 0s pausa abajo – 3s concéntrico – 1s pausa
                arriba.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                RPE
              </h4>
              <p>
                Escala 1–10. RPE 7 ≈ 3 reps en recámara; RPE 8 ≈ 2 reps. Evitar
                fallo.
              </p>
            </div>
          </div>
        </details>

        {/* Footer compacto */}
        <div className="text-center text-slate-400 text-[10px] mt-3 print:text-slate-700">
          <p>83kg | 1.75m | 23 años | Hipertrofia + Estética</p>
        </div>
      </div>

      {/* Selector Inteligente - búsqueda/autocompletado de ejercicios */}
      {selectorOpen.open && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-slate-800 rounded-xl w-full max-w-2xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold text-sm">
                🔎 Seleccionar ejercicio
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectorOpen({ open: false })}
                  className="text-slate-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="mb-3">
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o grupo (ej: press, espalda)..."
                className="w-full px-3 py-2 rounded bg-white/90 text-slate-800"
              />
              <div className="text-xs text-slate-400 mt-1">
                Mostrando sugerencias de la base. Seleccioná para reemplazar el
                nombre.
              </div>
            </div>

            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {suggestions.length === 0 ? (
                <div className="text-slate-400 text-sm">
                  No se encontraron ejercicios.
                </div>
              ) : (
                suggestions.map((sug) => {
                  return (
                    <button
                      key={sug.id}
                      onClick={() => handleSelectSuggestion(sug)}
                      className="text-left p-2 rounded hover:bg-slate-700 flex justify-between items-center border border-slate-600 bg-slate-700"
                    >
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {sug.nombre}
                        </div>
                        <div className="text-xs text-slate-300">
                          {sug.tempo ? `${sug.tempo} · ` : ""}
                          {sug.reps} · RPE {sug.rpe}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 capitalize">
                        {sug.grupo}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-3 flex gap-2 justify-end">
              <button
                onClick={() => {
                  if (selectorOpen.targetId)
                    setAltName(selectorOpen.targetId, undefined);
                  setSelectorOpen({ open: false });
                }}
                className="px-3 py-1 rounded bg-slate-600 text-white text-sm"
              >
                Usar nombre original
              </button>
              <button
                onClick={() => setSelectorOpen({ open: false })}
                className="px-3 py-1 rounded bg-indigo-600 text-white text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1RM (Epley) */}
      {oneRMModal.open && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
        >
          <div className="w-full max-w-md bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">
                🧮 Calculadora 1RM (Epley)
              </h3>
              <button
                onClick={() => setOneRMModal({ open: false })}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-2">
              <label className="text-slate-300 text-xs">Peso (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                value={oneRMModal.currentWeight ?? ""}
                onChange={(e) =>
                  setOneRMModal((s) => ({
                    ...s,
                    currentWeight: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded bg-white/90 text-slate-800"
                placeholder="kg"
              />

              <label className="text-slate-300 text-xs">
                Repeticiones realizadas
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={oneRMModal.currentReps ?? ""}
                onChange={(e) =>
                  setOneRMModal((s) => ({ ...s, currentReps: e.target.value }))
                }
                className="w-full px-3 py-2 rounded bg-white/90 text-slate-800"
                placeholder="reps"
              />

              <div className="bg-slate-700 rounded p-3 text-center">
                {(() => {
                  const res = computeEpley(
                    oneRMModal.currentWeight,
                    oneRMModal.currentReps
                  );
                  if (!res) {
                    return (
                      <div className="text-slate-300 text-sm">
                        Introduce peso y repeticiones válidas para ver el 1RM
                      </div>
                    );
                  }
                  return (
                    <div className="text-left">
                      <div className="text-white font-bold text-lg mb-2">
                        Estimado 1RM: {res.oneRM} kg
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                        <div className="p-2 bg-slate-800 rounded border border-slate-600">
                          50% →{" "}
                          <span className="font-semibold text-white">
                            {res.p50} kg
                          </span>
                        </div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-600">
                          70% →{" "}
                          <span className="font-semibold text-white">
                            {res.p70} kg
                          </span>
                        </div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-600">
                          80% →{" "}
                          <span className="font-semibold text-white">
                            {res.p80} kg
                          </span>
                        </div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-600">
                          90% →{" "}
                          <span className="font-semibold text-white">
                            {res.p90} kg
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setOneRMModal({ open: false })}
                  className="px-3 py-1 rounded bg-indigo-600 text-white text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
  @media print {
    * { box-shadow: none !important; }
    a, button { display: none !important; }
  }
  
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  @supports (padding-top: env(safe-area-inset-top)) {
    :root { --safe-top: env(safe-area-inset-top); }
  }
`}</style>
    </div>
  );
};

// === Calculadora Epley para 1RM ===
const computeEpley = (weightStr?: string, repsStr?: string) => {
  const weight = parseFloat((weightStr ?? "").toString().replace(",", "."));
  const reps = parseInt((repsStr ?? "").toString(), 10);

  if (
    !Number.isFinite(weight) ||
    !Number.isFinite(reps) ||
    weight <= 0 ||
    reps <= 0
  ) {
    return null;
  }

  // Fórmula Epley: 1RM = peso × (1 + reps/30)
  const oneRM = weight * (1 + reps / 30);

  return {
    oneRM: Math.round(oneRM * 10) / 10,
    p50: Math.round(oneRM * 0.5 * 10) / 10,
    p70: Math.round(oneRM * 0.7 * 10) / 10,
    p80: Math.round(oneRM * 0.8 * 10) / 10,
    p90: Math.round(oneRM * 0.9 * 10) / 10,
  };
};

export default RutinaGym;

// Versión VSCode
