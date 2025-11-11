import React, { useEffect, useMemo, useState } from "react";
import { Download, Info, Printer, BarChart3 } from "lucide-react";

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
  sets: Array<{ peso?: string; reps?: string }>;
  alt?: string;
  completed: boolean;
}

interface WorkoutSession {
  date: string;
  day: keyof typeof rutina;
  exercises: Record<string, SessionExercise>;
  totalVolume: number;
  duration?: number;
}

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

const RutinaGym: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<WorkoutSession[]>([]);

  const [done, setDone] = useState<Record<string, boolean>>({});
  
  const [logs, setLogs] = useState<
    Record<string, { sets?: Array<{ peso?: string; reps?: string }>; alt?: string }>
  >({});
  
  const [selectedDay, setSelectedDay] = useState<keyof typeof rutina>(
    (localStorage.getItem("rg-selectedDay") as keyof typeof rutina) || "lunes"
  );

  const [showHistory, setShowHistory] = useState(false);
  const [sessionStartTime] = useState<number>(() => Date.now());
  const [showLegend, setShowLegend] = useState(false);
  const [showVolumenSemanal, setShowVolumenSemanal] = useState(false);

  // Cargar datos desde IndexedDB al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        const historyData = await getFromDB(STORAGE_HISTORY);
        const currentData = await getFromDB(STORAGE_CURRENT);
        
        if (historyData) setHistory(historyData);
        if (currentData) {
          setDone(currentData.done || {});
          setLogs(currentData.logs || {});
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("rg-selectedDay", selectedDay);
  }, [selectedDay]);

  // Guardar historial en IndexedDB
  useEffect(() => {
    if (!isLoading && history.length > 0) {
      saveToDB(STORAGE_HISTORY, history);
    }
  }, [history, isLoading]);

  // Guardar sesión actual en IndexedDB
  useEffect(() => {
    if (!isLoading) {
      saveToDB(STORAGE_CURRENT, { done, logs });
    }
  }, [done, logs, isLoading]);

  const rutinaConIds = useMemo(() => {
    return Object.fromEntries(
      dias.map((d) => [d, withIds(rutina[d], d)])
    ) as typeof rutina;
  }, []);

  // Pre-cargar valores de última sesión del mismo día
  useEffect(() => {
    if (isLoading) return;
    
    const lastSession = history
      .filter((s) => s.day === selectedDay)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (lastSession && Object.keys(logs).length === 0) {
      setLogs(lastSession.exercises as any);
    }
  }, [selectedDay, isLoading]);

  const previousSession = useMemo(() => {
    return history
      .filter((s) => s.day === selectedDay)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [history, selectedDay]);

  const volumenSemanal = useMemo(() => {
    const acc = new Map<Grupo, { min: number; max: number }>();
    dias.forEach((d) => {
      rutinaConIds[d].ejercicios.forEach((e) => {
        const [minS, maxS] = seriesToRange(e.series);
        const cur = acc.get(e.grupo) || { min: 0, max: 0 };
        acc.set(e.grupo, { min: cur.min + minS, max: cur.max + maxS });
      });
    });
    return acc;
  }, [rutinaConIds]);

  const exportToCSV = () => {
    let csv =
      "DÍA,EJERCICIO,SERIES,REPS OBJETIVO,RPE,TEMPO,NOTAS,GRUPO MUSCULAR\n";

    dias.forEach((dia) => {
      const data = rutinaConIds[dia];
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

  // Exportar historial como JSON (backup)
  const exportHistorial = () => {
    const dataStr = JSON.stringify({ history, current: { done, logs } }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rutina-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert("✅ Backup descargado! Guárdalo en un lugar seguro.");
  };

  // Importar historial desde JSON
  const importHistorial = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (data.history) {
          setHistory(data.history);
          await saveToDB(STORAGE_HISTORY, data.history);
        }
        if (data.current) {
          setDone(data.current.done || {});
          setLogs(data.current.logs || {});
          await saveToDB(STORAGE_CURRENT, data.current);
        }
        
        alert("✅ Historial restaurado exitosamente!");
      } catch (error) {
        alert("❌ Error al importar el archivo. Asegurate que sea un backup válido.");
        console.error(error);
      }
    };
    
    input.click();
  };

  const handlePrint = () => window.print();

  const copiarResumen = async (dia: keyof typeof rutina, data: DiaRutina) => {
    const lineas: string[] = [];
    lineas.push(`${data.nombre}`);
    lineas.push("");

    data.ejercicios.forEach((ej, i) => {
      const idx = `E${i + 1}`;
      const sets = filledSets(ej.id, ej.series);

      const serial = sets.length > 0
        ? sets
            .map((s) => `${(s.peso ?? "").toString().trim()}×${(s.reps ?? "").toString().trim()}`)
            .join(" | ")
        : Array.from({ length: Math.max(1, minSeriesFrom(ej.series)) })
            .map(() => "___×___")
            .join(" | ");

      lineas.push(`${idx} ${displayName(ej)}: ${serial}  |  RPE objetivo: ${ej.rpe}`);
    });

    lineas.push("");
    lineas.push("Notas rápidas: ____________________________");

    const texto = lineas.join("\n");

    try {
      await navigator.clipboard.writeText(texto);
      alert("Resumen copiado. Pegalo en Notas/WhatsApp ✅");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Resumen copiado (fallback).");
    }
  };

  const day = rutinaConIds[selectedDay];

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
        completed: isDone(ej.id),
      };

      sets.forEach((s) => {
        const peso = parseFloat(s.peso || "0");
        const reps = parseFloat(s.reps || "0");
        totalVolume += peso * reps;
      });
    });

    const duration = Math.round((Date.now() - sessionStartTime) / 60000);

    const newSession: WorkoutSession = {
      date: new Date().toISOString(),
      day: selectedDay,
      exercises,
      totalVolume: Math.round(totalVolume),
      duration,
    };

    setHistory((prev) => [newSession, ...prev]);
    resetDay();
    
    alert(`✅ Sesión guardada!\n\nVolumen total: ${Math.round(totalVolume)} kg\nDuración: ${duration} min`);
  };

  const minSeriesFrom = (series: Series): number => {
    if (typeof series === "number") return series;
    const [min] = seriesToRange(series);
    return min;
  };

  const getSets = (id: string | undefined, series: Series) => {
    const k = keyFor(id);
    const entry = logs[k];
    const sets = entry?.sets ?? [];
    if (sets.length > 0) return sets;

    const n = Math.max(1, minSeriesFrom(series));
    return Array.from({ length: n }, () => ({ peso: "", reps: "" }));
  };

  const ensureEntry = (k: string) => {
    const e = logs[k];
    if (!e) {
      const created = { sets: [] as Array<{ peso?: string; reps?: string }>, alt: undefined as string | undefined };
      setLogs((prev) => ({ ...prev, [k]: created }));
      return created;
    }
    const neo = { sets: e.sets ?? [], alt: e.alt } as {
      sets: Array<{ peso?: string; reps?: string }>;
      alt?: string;
    };
    if (neo !== e) setLogs((prev) => ({ ...prev, [k]: neo }));
    return neo;
  };

  const setSetValue = (id: string | undefined, idx: number, field: "peso" | "reps", value: string) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const current = (entry.sets ?? []).slice();
    while (current.length <= idx) current.push({ peso: "", reps: "" });
    current[idx] = { ...current[idx], [field]: value };
    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
  };

  const addSet = (id: string | undefined) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const current = (entry.sets ?? []).slice();
    current.push({ peso: "", reps: "" });
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
    !!s && (s.peso ?? "").toString().trim() !== "" && (s.reps ?? "").toString().trim() !== "";

  const filledSets = (id: string | undefined, series: Series) =>
    getSets(id, series).filter(isFilled);

  const duplicateLastSet = (id: string | undefined) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const current = (entry.sets ?? []).slice();
    const last = current.length > 0 ? current[current.length - 1] : { peso: "", reps: "" };
    current.push({ peso: last.peso ?? "", reps: last.reps ?? "" });
    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
  };

  const clearEmptySets = (id: string | undefined, series: Series) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    let current = (entry.sets ?? []).slice();
    current = current.filter((s) => isFilled(s));
    if (current.length === 0) {
      current = Array.from({ length: Math.max(1, minSeriesFrom(series)) }, () => ({ peso: "", reps: "" }));
    }
    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
  };

  const setAltName = (id: string | undefined, alt: string | undefined) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const clean = (alt ?? "").trim();
    setLogs((prev) => ({ ...prev, [k]: { ...entry, alt: clean || undefined } }));
  };

  const displayName = (ej: Ejercicio) => {
    const k = keyFor(ej.id);
    const entry = logs[k] as any;
    const alt = entry && "alt" in entry ? entry.alt : undefined;
    return (alt && alt.trim()) ? alt.trim() : ej.nombre;
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
      minute: "2-digit"
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
        <div className="bg-slate-800 rounded-lg shadow-xl p-3 md:p-4 mb-3 border border-slate-700 print:shadow-none print:border-0 print:bg-white">
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
                  className="bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 text-xs rounded transition print:hidden"
                >
                  📊 ({history.length})
                </button>
                <button
                  onClick={exportHistorial}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-xs rounded transition print:hidden"
                  title="Backup"
                >
                  💾
                </button>
                <button
                  onClick={importHistorial}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 text-xs rounded transition print:hidden"
                  title="Restaurar"
                >
                  📂
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
                  {[...volumenSemanal.entries()].map(([grupo, { min, max }]) => (
                    <div
                      key={grupo}
                      className={`rounded p-2 border text-xs ${colorLegend[grupo].border} ${colorLegend[grupo].bg}`}
                    >
                      <div className={`font-semibold ${colorLegend[grupo].text} capitalize`}>
                        {grupo}
                      </div>
                      <div className="text-slate-700 font-mono text-xs">
                        {min === max ? min : `${min}–${max}`} series
                      </div>
                    </div>
                  ))}
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

        {/* Modal de Historial */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">📊 Historial de Entrenamientos</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-white hover:text-slate-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              {history.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Aún no hay sesiones guardadas. Completa tu primer entrenamiento!
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
                          <div className="flex gap-4 mt-1 text-sm text-slate-300">
                            <span>💪 Volumen: {session.totalVolume} kg</span>
                            {session.duration && <span>⏱️ {session.duration} min</span>}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2 text-sm">
                        {Object.entries(session.exercises).map(([exId, exData]) => {
                          const originalEx = rutinaConIds[session.day].ejercicios.find(
                            (e) => e.id === exId
                          );
                          if (!originalEx) return null;

                          const displayEx = exData.alt || originalEx.nombre;
                          const setsStr = exData.sets
                            .map((s) => `${s.peso}×${s.reps}`)
                            .join(" | ");

                          return (
                            <div
                              key={exId}
                              className={`p-2 rounded ${
                                exData.completed ? "bg-slate-600" : "bg-slate-700/50"
                              }`}
                            >
                              <span className={exData.completed ? "text-white" : "text-slate-400"}>
                                {exData.completed ? "✓" : "○"} {displayEx}
                              </span>
                              <span className="text-slate-300 ml-2 font-mono text-xs">
                                {setsStr || "—"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comparación con sesión anterior - más compacto */}
        {previousSession && !showHistory && (
          <div className="bg-slate-800 rounded-lg p-2 mb-3 border border-slate-700 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>🔄 {formatDate(previousSession.date).split(',')[0]}</span>
              <span className="font-bold">{previousSession.totalVolume} kg</span>
              <span>{previousSession.duration}min</span>
            </div>
          </div>
        )}

        {/* Tabla de ejercicios - COMPACTA */}
        <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700 print:border-0 print:shadow-none print:bg-white mb-3">
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
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs" role="table">
              <thead className="bg-slate-700 print:bg-slate-100">
                <tr>
                  <th className="px-2 py-2 text-left text-slate-300 print:text-slate-800">✓</th>
                  <th className="px-2 py-2 text-left text-slate-300 print:text-slate-800 sticky left-0 bg-slate-700 z-10">
                    Ejercicio
                  </th>
                  <th className="px-2 py-2 text-center text-slate-300 print:text-slate-800">S</th>
                  <th className="px-2 py-2 text-center text-slate-300 print:text-slate-800">Reps</th>
                  <th className="px-2 py-2 text-left text-slate-300 print:text-slate-800">kg × reps</th>
                  <th className="px-2 py-2 text-center text-slate-300 print:text-slate-800">RPE</th>
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
                      
                      <td className={`px-2 py-2 font-semibold ${colors.text} sticky left-0 ${colors.bg} z-10`}>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[10px] text-slate-600">E{idx + 1}</span>
                            <span className="text-[11px] leading-tight">{displayName(ej)}</span>
                          </div>
                          {previousSession?.exercises[ej.id!] && (
                            <div className="text-[10px] text-slate-500">
                              ← {previousSession.exercises[ej.id!].sets
                                .map((s) => `${s.peso}×${s.reps}`)
                                .join(" ")}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const actual = displayName(ej);
                              const nuevo = window.prompt("Reemplazar:", actual);
                              if (nuevo !== null) setAltName(ej.id, nuevo);
                            }}
                            className="text-[10px] px-1 rounded border border-slate-400 hover:bg-slate-200 text-slate-700 bg-white/70 w-fit"
                          >
                            Reemplazar
                          </button>
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
                          {getSets(ej.id, ej.series).map((s, sidx) => (
                            <div key={sidx} className="flex items-center gap-0.5">
                              <input
                                type="number"
                                inputMode="decimal"
                                placeholder="kg"
                                value={s.peso ?? ""}
                                onChange={(e) => setSetValue(ej.id, sidx, "peso", e.target.value)}
                                className="w-12 text-center px-1 py-0.5 text-xs rounded border border-slate-400 bg-white/70"
                              />
                              <span className="text-slate-600 text-xs">×</span>
                              <input
                                type="number"
                                inputMode="numeric"
                                placeholder="r"
                                value={s.reps ?? ""}
                                onChange={(e) => setSetValue(ej.id, sidx, "reps", e.target.value)}
                                className="w-10 text-center px-1 py-0.5 text-xs rounded border border-slate-400 bg-white/70"
                              />
                              <button
                                type="button"
                                onClick={() => removeSet(ej.id, sidx)}
                                className="px-1 text-xs rounded border border-slate-400 hover:bg-slate-200"
                              >
                                −
                              </button>
                            </div>
                          ))}

                          <div className="flex gap-0.5 mt-1">
                            <button
                              onClick={() => addSet(ej.id)}
                              className="px-1 text-[10px] rounded border border-slate-400 hover:bg-slate-200"
                            >
                              +
                            </button>
                            <button
                              onClick={() => duplicateLastSet(ej.id)}
                              className="px-1 text-[10px] rounded border border-slate-400 hover:bg-slate-200"
                            >
                              Dup
                            </button>
                            <button
                              onClick={() => clearEmptySets(ej.id, ej.series)}
                              className="px-1 text-[10px] rounded border border-slate-400 hover:bg-slate-200"
                            >
                              Limp
                            </button>
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
              <div key={idx} className="bg-slate-700 rounded p-2 border-l-2 border-indigo-500 print:bg-white">
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
                8-10 / 9-11 / 10-12 = progresión semanal. Al completar semana 3, subir peso y volver a 8-10.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                Back-off Sets
              </h4>
              <p>
                Reducir ~10% el peso en las series finales para mantener calidad técnica.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                Tempo (ej: 1-0-3-1)
              </h4>
              <p>
                1s excéntrico – 0s pausa abajo – 3s concéntrico – 1s pausa arriba.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                RPE
              </h4>
              <p>
                Escala 1–10. RPE 7 ≈ 3 reps en recámara; RPE 8 ≈ 2 reps. Evitar fallo.
              </p>
            </div>
          </div>
        </details>

        {/* Footer compacto */}
        <div className="text-center text-slate-400 text-[10px] mt-3 print:text-slate-700">
          <p>83kg | 1.75m | 23 años | Hipertrofia + Estética</p>
        </div>
      </div>

      <style>{`
        @media print {
          * { box-shadow: none !important; }
          a, button { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default RutinaGym;