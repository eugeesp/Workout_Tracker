import React, { useEffect, useMemo, useState, useRef } from "react";
import { abdominales, colorLegend, dias, rutina } from "./data/rutina";
import { buscarEjercicios, ejerciciosDB } from "./data/ejercicios";
import { getFromDB, saveToDB } from "./storage/indexedDb";
import { normalizeRutina, withIds } from "./utils/rutinaUtils";
import { Ejercicio, Grupo, Series, SessionExercise, WorkoutSession, SerieLog } from "./types";

const STORAGE_HISTORY = "rg-history-v2" as const;
const STORAGE_CURRENT = "rg-current-v2" as const;
const STORAGE_RUTINA = "rg-rutina-v1" as const;

const RutinaGym: React.FC = () => {
  // =======================
  // 1. TODOS LOS HOOKS PRIMERO
  // =======================

  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [logs, setLogs] = useState<
    Record<
      string,
      {
        sets?: Array<SerieLog>;
        alt?: string;
        notes?: string;
      }
    >
  >({});
  const [selectedDay, setSelectedDay] = useState<keyof typeof rutina>(() => {
    const raw = localStorage.getItem("rg-selectedDay");
    if (raw && (dias as string[]).includes(raw)) {
      return raw as keyof typeof rutina;
    }
    return "lunes";
  });
  const [showHistory, setShowHistory] = useState(false);
  const sessionStartTimeRef = useRef(Date.now());
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [bodyWeight, setBodyWeight] = useState<string>("");
  const [exerciseNotesOpen, setExerciseNotesOpen] = useState<Record<string, boolean>>({});
  const [setNotesOpen, setSetNotesOpen] = useState<Record<string, Record<number, boolean>>>({});
  const [selectorOpen, setSelectorOpen] = useState<{
    open: boolean;
    targetId?: string;
    grupo?: Grupo;
    mode?: "replace" | "add";
  }>({ open: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Ejercicio[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [rutinaState, setRutinaState] = useState<typeof rutina | null>(null);
  // small ref counter so multiple independent loads don't race to set loading=false
  const pendingLoadsRef = useRef<number>(2);

  // Cargar datos desde IndexedDB al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout cargando datos")), 3000)
        );

        const result = await Promise.race([
          Promise.all([getFromDB(STORAGE_HISTORY), getFromDB(STORAGE_CURRENT)]),
          timeoutPromise,
        ]);

        const [historyData, currentData] = result as [any, any];

        if (historyData) setHistory(historyData);
        if (currentData) {
          const migratedLogs = currentData.logs || {};
          Object.keys(migratedLogs).forEach((k) => {
            if (!migratedLogs[k].notes) {
              migratedLogs[k].notes = undefined;
            }
            const sets = migratedLogs[k].sets;
            if (Array.isArray(sets)) {
              migratedLogs[k].sets = sets.map((s: SerieLog) => ({
                ...s,
                fallo: s?.fallo ?? false,
              }));
            }
          });
          setLogs(migratedLogs);

          if (currentData.bodyWeight) {
            setBodyWeight(currentData.bodyWeight.toString());
          }
        }
      } catch (error) {
        console.error("Error o timeout loading datos:", error);
      } finally {
        pendingLoadsRef.current = Math.max(0, pendingLoadsRef.current - 1);
        if (pendingLoadsRef.current <= 0) setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Cargar rutina persistida al montar
  useEffect(() => {
    const loadRutina = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout cargando rutina")), 3000)
        );

        const stored = await Promise.race([getFromDB(STORAGE_RUTINA), timeoutPromise]);

        if (stored) {
          console.log("📥 Rutina cargada desde DB:", stored);
          setRutinaState(normalizeRutina(stored));
        } else {
          console.log("📝 Inicializando rutina por defecto");
          setRutinaState(
            normalizeRutina(Object.fromEntries(dias.map((d) => [d, withIds(rutina[d], d)])))
          );
        }
      } catch (err) {
        console.error("Error o timeout cargando rutina:", err);
        setRutinaState(
          normalizeRutina(Object.fromEntries(dias.map((d) => [d, withIds(rutina[d], d)])))
        );
      } finally {
        pendingLoadsRef.current = Math.max(0, pendingLoadsRef.current - 1);
        if (pendingLoadsRef.current <= 0) setIsLoading(false);
      }
    };
    loadRutina();
  }, []);

  // Guardar rutina cada vez que cambia
  useEffect(() => {
    if (rutinaState && Object.keys(rutinaState).length > 0) {
      console.log("💾 Guardando rutina en DB:", rutinaState);
      saveToDB(STORAGE_RUTINA, rutinaState).catch((e) =>
        console.error("Error guardando rutina:", e)
      );
    }
  }, [rutinaState]);

  // Guardar historial
  useEffect(() => {
    if (!isLoading && history.length > 0) {
      saveToDB(STORAGE_HISTORY, history);
    }
  }, [history, isLoading]);

  // Guardar sesión actual
  useEffect(() => {
    if (!isLoading) {
      const bodyWeightNum = parseFloat(bodyWeight || "0");
      saveToDB(STORAGE_CURRENT, {
        logs,
        bodyWeight: bodyWeightNum > 0 ? bodyWeightNum : undefined,
      });
    }
  }, [logs, bodyWeight, isLoading]);

  useEffect(() => {
    localStorage.setItem("rg-selectedDay", selectedDay);
  }, [selectedDay]);

  // Auto-focus y sugerencias cuando se abre el selector
  useEffect(() => {
    if (selectorOpen.open) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
      setSearchTerm("");
      const byGroup = ejerciciosDB.filter((ej) => ej.grupo === selectorOpen.grupo);
      setSuggestions(byGroup.slice(0, 8));
    } else {
      setSuggestions([]);
      setSearchTerm("");
    }
  }, [selectorOpen]);

  // Actualizar sugerencias cuando cambia búsqueda (con debounce)
  useEffect(() => {
    if (!selectorOpen.open) return;

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const term = (searchTerm || "").trim();

    // If empty, show default group suggestions immediately
    if (term === "") {
      const results = ejerciciosDB.filter((ej) => ej.grupo === selectorOpen.grupo);
      setSuggestions(results.slice(0, 12));
      return;
    }

    // Debounce search for typed queries (200ms delay)
    debounceTimerRef.current = setTimeout(() => {
      let results = buscarEjercicios(term);
      if (selectorOpen.grupo) {
        results = results.sort((a, _b) => (a.grupo === selectorOpen.grupo ? -1 : 1));
      }
      setSuggestions(results.slice(0, 12));
    }, 200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, selectorOpen]);

  // Pre-cargar valores de última sesión
  useEffect(() => {
    if (isLoading) return;

    const lastSession = history
      .filter((s) => s.day === selectedDay)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (lastSession && Object.keys(logs).length === 0) {
      const migrated = Object.fromEntries(
        Object.entries(lastSession.exercises).map(([exId, exData]) => [
          `${lastSession.day}:${exId}`,
          exData,
        ])
      );
      setLogs(migrated as any);
    }
  }, [selectedDay, isLoading, history]);

  // =======================
  // 2. LOS useMemo
  // =======================
  const previousSession = useMemo(() => {
    return history
      .filter((s) => s.day === selectedDay)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [history, selectedDay]);

  // =======================
  // 3. AHORA SÍ el return temprano de loading
  // =======================
  if (isLoading || !rutinaState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center safe-area-top safe-area-bottom">
        <div className="text-white text-xl">Cargando rutina... 💪</div>
      </div>
    );
  }

  // =======================
  // 4. EL RESTO DEL CÓDIGO
  // =======================

  const day = rutinaState[selectedDay];

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

  const formatRIR = (min?: number | null, max?: number | null): string => {
    if (min === null || min === undefined) return "";
    if (max === null || max === undefined) return min.toString();
    return `${min}-${max}`;
  };

  const emptySet = (): SerieLog => ({
    reps: "",
    peso: "",
    rir: "",
    note: "",
    fallo: false,
  });

  const normalizeSets = (sets?: SerieLog[]): SerieLog[] => {
    if (!Array.isArray(sets)) return [];
    return sets.map((s) => ({
      ...emptySet(),
      ...s,
      reps: s?.reps ?? "",
      peso: s?.peso ?? "",
      rir: s?.rir ?? "",
      note: s?.note ?? "",
      fallo: s?.fallo ?? false,
    }));
  };

  const setExerciseNote = (exerciseId: string, note: string) => {
    const key = keyFor(exerciseId);
    setLogs((prev) => {
      const existing = prev[key] ?? { sets: [] as SerieLog[], notes: "" };
      return {
        ...prev,
        [key]: {
          ...existing,
          notes: note,
        },
      };
    });
  };

  const getExerciseNote = (exerciseId: string | undefined): string => {
    if (!exerciseId) return "";
    const key = keyFor(exerciseId);
    const entry = logs[key];
    return entry?.notes ?? "";
  };

  const nextDay = () => {
    const currentIndex = dias.indexOf(selectedDay);
    const nextIndex = (currentIndex + 1) % dias.length;
    setSelectedDay(dias[nextIndex]);
    setExpandedExercise(null);
  };

  const previousDay = () => {
    const currentIndex = dias.indexOf(selectedDay);
    const prevIndex = (currentIndex - 1 + dias.length) % dias.length;
    setSelectedDay(dias[prevIndex]);
    setExpandedExercise(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeStartX || !isSwiping) return;

    const currentX = e.touches[0].clientX;
    const diff = swipeStartX - currentX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextDay();
      } else {
        previousDay();
      }
      setSwipeStartX(null);
      setIsSwiping(false);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    setSwipeStartX(null);
  };

  // Hook para navegación entre inputs
  const createInputProps = (
    exerciseId: string,
    setIndex: number,
    inputType: "reps" | "peso" | "rirMin" | "rirMax"
  ) => {
    const getNextInput = (): string | null => {
      switch (inputType) {
        case "reps":
          return `${exerciseId}-${setIndex}-peso`;
        case "peso":
          return `${exerciseId}-${setIndex}-rirMin`;
        case "rirMin":
          return `${exerciseId}-${setIndex}-rirMax`;
        case "rirMax":
          const sets = getSets(exerciseId, 3);
          if (setIndex < sets.length - 1) {
            return `${exerciseId}-${setIndex + 1}-reps`;
          } else {
            setTimeout(() => addSet(exerciseId), 50);
            return `${exerciseId}-${setIndex + 1}-reps`;
          }
        default:
          return null;
      }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const nextInputId = getNextInput();
        if (nextInputId) {
          setTimeout(() => {
            const nextInput = document.getElementById(nextInputId);
            nextInput?.focus();
          }, 10);
        }
      }
    };

    return {
      id: `${exerciseId}-${setIndex}-${inputType}`,
      onKeyDown,
    };
  };

  const updateExercise = (
    day: keyof typeof rutinaState,
    ejId: string,
    patch: Partial<Ejercicio>
  ) => {
    setRutinaState((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      copy[day] = {
        ...copy[day],
        ejercicios: copy[day].ejercicios.map((ej) => (ej.id === ejId ? { ...ej, ...patch } : ej)),
      };
      return copy;
    });
  };

  const addExercise = (day: keyof typeof rutinaState, ejercicio: Ejercicio) => {
    setRutinaState((prev) => {
      if (!prev) return prev;
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
    setLogs((l) => {
      const copy = { ...l };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${day}:`) && k.includes(ejId)) delete copy[k];
      });
      return copy;
    });
    setExerciseNotesOpen((prev) => {
      if (!(ejId in prev)) return prev;
      const copy = { ...prev };
      delete copy[ejId];
      return copy;
    });
    setSetNotesOpen((prev) => {
      if (!(ejId in prev)) return prev;
      const copy = { ...prev };
      delete copy[ejId];
      return copy;
    });

    setRutinaState((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      copy[day] = {
        ...copy[day],
        ejercicios: copy[day].ejercicios.filter((e) => e.id !== ejId),
      };
      return copy;
    });
  };

  const moveExercise = (day: keyof typeof rutinaState, ejId: string, dir: "up" | "down") => {
    setRutinaState((prev) => {
      if (!prev) return prev;
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

  const handleSelectSuggestion = (sug: Ejercicio) => {
    if (!selectorOpen.open) return;

    if (selectorOpen.mode === "add") {
      addExercise(selectedDay, { ...sug, id: undefined });
      setSelectorOpen({ open: false });
      return;
    }

    if (selectorOpen.mode === "replace" && selectorOpen.targetId) {
      updateExercise(selectedDay, selectorOpen.targetId, {
        nombre: sug.nombre,
        series: sug.series,
        reps: sug.reps,
        grupo: sug.grupo,
      });
      setAltName(selectorOpen.targetId, sug.nombre);
      setSelectorOpen({ open: false });
      return;
    }

    setSelectorOpen({ open: false });
  };

  const sanitizeTSV = (v: any): string => {
    if (v === null || v === undefined) return "";
    return String(v).replace(/\t/g, " ").replace(/\r?\n/g, " / ").trim();
  };

  const asRIR = (v: any): string => {
    const raw = sanitizeTSV(v);
    return raw === "" ? "-" : raw;
  };

  const rirValueForSet = (s: SerieLog): string => {
    if (s.fallo) return "F";
    return asRIR(s.rir);
  };

  const generarTablaParaSheets = (): string => {
    const header = [
      "Fecha",
      "Día / Ejercicio",
      "Series / Reps",
      "RIR",
      "Peso corporal",
      "Notas",
      "Notas series",
    ].join("\t");

    const fechaStr = new Date().toISOString().split("T")[0];
    const pesoStr = bodyWeight ? sanitizeTSV(bodyWeight) : "";

    let tsv = `${header}\n`;
    tsv += [fechaStr, sanitizeTSV(day.nombre), "", "", pesoStr, "", ""]
      .map((cell) => sanitizeTSV(cell))
      .join("\t");
    tsv += "\n";

    day.ejercicios.forEach((ej) => {
      const k = keyFor(ej.id);
      const entry = logs[k];

      const sets = normalizeSets(entry?.sets);

      const repsList = sets.map((s) => sanitizeTSV(s.reps)).join(",");
      const rirsList = sets.map((s) => sanitizeTSV(rirValueForSet(s))).join(",");
      const seriesNotesSummary = sets
        .map((s, index) => {
          const raw = (s?.note ?? (s as any)?.notes ?? "").trim();
          if (!raw) return "";
          return `S${index + 1}: ${raw}`;
        })
        .filter(Boolean)
        .join(" | ");
      const nota = sanitizeTSV(getExerciseNote(ej.id) || entry?.notes || "");

      tsv += [
        "",
        sanitizeTSV(displayName(ej)),
        `'${repsList}`,
        `'${rirsList}`,
        "",
        nota,
        sanitizeTSV(seriesNotesSummary),
      ]
        .map((cell) => sanitizeTSV(cell))
        .join("\t");
      tsv += "\n";
    });

    return tsv;
  };

  const copiarDiaCompleto = async () => {
    const lines: string[] = [];
    const hoy = new Date();
    const fechaStr = hoy.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const grupos = Array.from(new Set(day.ejercicios.map((e) => e.grupo))).join(" / ");
    lines.push(`${fechaStr} - ${day.nombre} - ${grupos}`);
    lines.push("");

    day.ejercicios.forEach((ej, i) => {
      lines.push(`${i + 1}. ${ej.nombre}`);

      const k = keyFor(ej.id);
      const entry = logs[k];
      const exerciseNote = (getExerciseNote(ej.id) || entry?.notes || "").trim();

      const sets = filledSets(ej.id, ej.series);
      if (sets.length === 0) {
        lines.push("(sin series registradas)");
      } else {
        sets.forEach((s, si) => {
          const reps = (s.reps ?? "").toString().trim();
          const peso = (s.peso ?? "").toString().trim();
          const rir = (s.rir ?? "").toString().trim();
          const rirSuffix = s.fallo ? " @FALLO" : rir ? ` @RIR ${rir}` : "";
          lines.push(`   ${si + 1}) ${reps} x ${peso}kg${rirSuffix}`);

          const setNote = (s.note ?? (s as any).notes ?? "").trim();
          if (setNote) {
            lines.push(`      • Nota serie: ${setNote}`);
          }
        });
      }

      if (exerciseNote) {
        lines.push(`   Notas ejercicio: ${exerciseNote}`);
      }

      lines.push("");
    });

    const texto = lines.join("\n");

    try {
      await navigator.clipboard.writeText(texto);
      alert("Dia copiado al portapapeles. Pegalo donde quieras.");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Dia copiado (fallback).");
    }
  };

  const keyFor = (id?: string) => `${selectedDay}:${id ?? ""}`;

  const resetDay = () => {
    console.log("🧹 Limpiando día:", selectedDay);

    setLogs((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((k) => {
        if (k.startsWith(`${selectedDay}:`)) {
          delete copy[k];
        }
      });
      return copy;
    });

    setExerciseNotesOpen({});
    setSetNotesOpen({});

    setBodyWeight("");
    sessionStartTimeRef.current = Date.now();
    console.log("✅ Día limpiado completamente");
  };

  const finalizarSesion = () => {
    const exercises: Record<string, SessionExercise> = {};
    let totalVolume = 0;

    day.ejercicios.forEach((ej) => {
      const k = keyFor(ej.id);
      const entry = logs[k];
      const sets = normalizeSets(entry?.sets).filter(isFilled);

      exercises[ej.id!] = {
        sets: sets,
        alt: entry?.alt,
        notes: entry?.notes,
      };

      sets.forEach((s) => {
        const peso = parseFloat(s.peso || "0");
        const reps = parseFloat(s.reps || "0");
        totalVolume += peso * reps;
      });
    });

    const duration = Math.round((Date.now() - sessionStartTimeRef.current) / 60000);
    const bodyWeightNum = parseFloat(bodyWeight || "0");

    const newSession: WorkoutSession = {
      date: new Date().toISOString(),
      day: selectedDay,
      exercises,
      totalVolume: Math.round(totalVolume),
      bodyWeight: bodyWeightNum > 0 ? bodyWeightNum : undefined,
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

  const getSets = (id: string | undefined, _series: Series): SerieLog[] => {
    const k = keyFor(id);
    const entry = logs[k];
    const sets = normalizeSets(entry?.sets);
    if (sets.length > 0) return sets;
    return [emptySet()];
  };

  const ensureEntry = (k: string) => {
    const e = logs[k];
    if (!e) {
      const created = {
        sets: [] as Array<SerieLog>,
        alt: undefined as string | undefined,
        notes: undefined as string | undefined,
      };
      setLogs((prev) => ({ ...prev, [k]: created }));
      return created;
    }
    const neo = {
      sets: normalizeSets(e.sets),
      alt: e.alt,
      notes: e.notes,
    } as {
      sets: Array<SerieLog>;
      alt?: string;
      notes?: string;
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
    const current = normalizeSets(entry.sets);
    while (current.length <= idx) current.push(emptySet());

    const set = current[idx];

    if (field === "peso" || field === "reps") {
      current[idx] = { ...set, [field]: value };
    } else if (field === "rirMin") {
      const minVal = value.trim() === "" ? null : parseInt(value, 10);
      const [, maxVal] = parseRIR(set.rir);
      if (minVal !== null && !Number.isFinite(minVal)) return;
      current[idx] = { ...set, rir: formatRIR(minVal, maxVal) };
    } else if (field === "rirMax") {
      const [minVal] = parseRIR(set.rir);
      const maxVal = value.trim() === "" ? null : parseInt(value, 10);
      if (maxVal !== null && !Number.isFinite(maxVal)) return;
      current[idx] = { ...set, rir: formatRIR(minVal, maxVal) };
    }

    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
  };

  const toggleFallo = (exerciseId: string | undefined, setIndex: number) => {
    if (!exerciseId) return;
    const key = keyFor(exerciseId);
    const entry = ensureEntry(key);
    const sets = normalizeSets(entry.sets);
    while (sets.length <= setIndex) sets.push(emptySet());

    const currentSet = sets[setIndex] ?? emptySet();
    const nextFallo = currentSet.fallo !== true;

    sets[setIndex] = {
      ...currentSet,
      fallo: nextFallo,
      rir: nextFallo ? "" : currentSet.rir ?? "",
    };

    setLogs((prev) => ({ ...prev, [key]: { ...entry, sets } }));
  };

  const setSetNote = (exerciseId: string, index: number, note: string) => {
    const key = keyFor(exerciseId);
    setLogs((prev) => {
      const entry = prev[key] ?? { sets: [] as SerieLog[] };

      const sets = normalizeSets(entry.sets);
      const current = sets[index] || emptySet();
      sets[index] = {
        ...current,
        note,
      };

      return {
        ...prev,
        [key]: {
          ...entry,
          sets,
        },
      };
    });
  };

  const addSet = (id: string | undefined) => {
    if (!id) return;
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const current = normalizeSets(entry.sets);
    const hasPrevious = current.length > 0;
    const last = hasPrevious ? current[current.length - 1] : emptySet();
    current.push({
      peso: hasPrevious ? last.peso ?? "" : "",
      reps: hasPrevious ? last.reps ?? "" : "",
      rir: hasPrevious ? last.rir ?? "" : "",
      note: hasPrevious ? last.note ?? "" : "",
      fallo: hasPrevious ? last.fallo ?? false : false,
    });
    const newIndex = current.length - 1;
    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));

    setTimeout(() => {
      const nextInputId = `${id}-${newIndex}-reps`;
      const nextInput = document.getElementById(nextInputId);
      nextInput?.focus();
    }, 0);
  };

  const removeSet = (id: string | undefined, idx: number) => {
    const k = keyFor(id);
    const entry = ensureEntry(k);
    const current = normalizeSets(entry.sets);
    if (current.length === 0) return;
    current.splice(idx, 1);
    setLogs((prev) => ({ ...prev, [k]: { ...entry, sets: current } }));
    setSetNotesOpen((prev) => {
      if (!id) return prev;
      const existing = prev[id];
      if (!existing) return prev;
      const updated: Record<number, boolean> = {};
      Object.entries(existing).forEach(([key, value]) => {
        const numKey = Number(key);
        if (Number.isNaN(numKey) || numKey === idx) return;
        const nextIndex = numKey > idx ? numKey - 1 : numKey;
        updated[nextIndex] = value;
      });
      return { ...prev, [id]: updated };
    });
  };

  const isFilled = (s?: SerieLog) =>
    !!s && (s.peso ?? "").toString().trim() !== "" && (s.reps ?? "").toString().trim() !== "";

  const filledSets = (id: string | undefined, series: Series) =>
    getSets(id, series).filter(isFilled);

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

  // =======================
  // 5. RENDER
  // =======================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 md:p-6 print:bg-white print:p-0 safe-area-top safe-area-bottom">
      <div className="max-w-7xl mx-auto">
        {/* Header compacto */}
        <div
          className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700 safe-area-top"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={previousDay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all"
              >
                <span className="text-white text-lg">←</span>
              </button>

              <div className="flex-1 text-center mx-2">
                <h1 className="text-white font-bold text-lg uppercase">{selectedDay}</h1>
              </div>

              <button
                onClick={nextDay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all"
              >
                <span className="text-white text-lg">→</span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 mt-3">
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 border border-slate-600">
                <span className="text-white font-semibold text-sm">Peso</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(e.target.value)}
                  placeholder="kg"
                  className="w-16 text-center bg-slate-700 text-white font-bold border-0 rounded text-sm py-1"
                />
                {bodyWeight && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
              </div>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded transition-all"
                title="Historial"
              >
                <span className="text-slate-300 text-sm">📊</span>
              </button>
            </div>
          </div>

          {isSwiping && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
          )}
        </div>

        {showHistory && (
          <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 p-0 md:items-center md:p-4">
            <div className="bg-slate-900 rounded-t-3xl md:rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-700">
              <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-900 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">📊 Historial</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-white text-lg"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex justify-center mt-2 md:hidden">
                  <div className="w-12 h-1 bg-slate-600 rounded-full"></div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    Aún no hay sesiones guardadas
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((session, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800 rounded-xl p-4 border border-slate-700"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-semibold capitalize">
                              {session.day} - {new Date(session.date).toLocaleDateString("es-AR")}
                            </h4>
                            <div className="flex gap-3 mt-1 text-sm text-slate-300 flex-wrap">
                              <span>💪 {session.totalVolume} kg</span>
                              {session.duration && <span>⏱️ {session.duration} min</span>}
                              {session.bodyWeight && <span>⚖️ {session.bodyWeight} kg</span>}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {Object.entries(session.exercises).map(([exId, exData]) => {
                            const dayRutina = rutinaState[session.day as keyof typeof rutinaState];

                            // Si por alguna razón esta sesión tiene un "day" que ya no existe en la rutina actual,
                            // nos salteamos ese ejercicio para no romper todo.
                            if (!dayRutina) {
                              console.warn("Sesión con día desconocido en history:", session.day);
                              return null;
                            }

                            const originalEx = dayRutina.ejercicios.find((e) => e.id === exId);
                            if (!originalEx) return null;

                            return (
                              <div key={exId} className="p-2 rounded-lg bg-slate-700/70">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-white">{exData.alt || originalEx.nombre}</span>
                                    <div className="text-slate-300 text-xs mt-1 font-mono">
                                      {normalizeSets(exData.sets).map((s, i) => {
                                        const rirText = s.fallo ? "F" : s.rir;
                                        return (
                                          <span key={i} className="mr-2">
                                            {s.peso}×{s.reps}
                                            {rirText ? `(${rirText})` : ""}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  {exData.notes && (
                                    <span className="text-slate-400 text-xs italic">📝</span>
                                  )}
                                </div>
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
          </div>
        )}

        <div className="space-y-3 px-2 mt-3 mb-16">
          {day.ejercicios.map((ej, idx) => {
            const colors = colorLegend[ej.grupo];
            const isExpanded = expandedExercise === ej.id;
            const sets = getSets(ej.id, ej.series);
            const filledCount = filledSets(ej.id, ej.series).length;
            const exerciseNote = getExerciseNote(ej.id);
            const isExerciseNoteOpen = !!exerciseNotesOpen[ej.id!];

            return (
              <div
                key={ej.id}
                className={`rounded-xl border-l-4 ${colors.border} ${
                  colors.bg
                } transition-all duration-200 ${isExpanded ? "ring-2 ring-white/20" : ""}`}
              >
                <div
                  className="p-4 cursor-pointer"
                  role="button"
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedExercise(isExpanded ? null : ej.id!)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-600 bg-white/50 px-1.5 py-0.5 rounded">
                          E{idx + 1}
                        </span>
                        <span
                          className={`font-semibold text-sm leading-tight ${colors.text} break-words`}
                        >
                          {displayName(ej)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-slate-700">
                        <span className="font-bold">{ej.series}s</span>
                        <span className="font-mono">{ej.reps}r</span>
                        {filledCount > 0 && (
                          <span className="bg-white/50 px-1.5 py-0.5 rounded font-semibold">
                            {filledCount}✅
                          </span>
                        )}
                      </div>

                      {previousSession?.exercises[ej.id!] && (
                        <div className="text-[10px] text-slate-500 mt-1">
                          ← Prev:{" "}
                          {previousSession.exercises[ej.id!].sets
                            .slice(0, 2)
                            .map((s) => `${s.peso}×${s.reps}`)
                            .join(" ")}
                          {previousSession.exercises[ej.id!].sets.length > 2 && "..."}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExerciseNotesOpen((prev) => ({
                            ...prev,
                            [ej.id!]: !prev[ej.id!],
                          }));
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 border border-slate-300 text-xs"
                        title="Notas del ejercicio"
                      >
                        🗒️
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/20 pt-4 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-700 text-sm">Series realizadas:</h4>
                        <div className="flex gap-1">
                          <button
                            onClick={() => addSet(ej.id)}
                            className="px-2 py-1 text-xs bg-white/70 rounded border border-slate-400"
                          >
                            + Serie
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {sets.map((s, sidx) => {
                          const isFallo = s.fallo === true;
                          const [rirMin, rirMax] = isFallo ? [null, null] : parseRIR(s.rir);
                          const setNoteOpen = setNotesOpen[ej.id!]?.[sidx] ?? false;
                          return (
                            <div key={sidx} className="space-y-1">
                              <div
                                className={`grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 rounded-lg p-2 border ${
                                  isFallo ? "bg-amber-100 border-amber-300" : "bg-white/50 border-transparent"
                                }`}
                              >
                                <span className="text-xs font-semibold text-slate-700 w-6">
                                  {sidx + 1}.
                                </span>

                                <input
                                  {...createInputProps(ej.id!, sidx, "reps")}
                                  type="number"
                                  inputMode="numeric"
                                  placeholder="Reps"
                                  value={s.reps ?? ""}
                                  onChange={(e) => setSetValue(ej.id, sidx, "reps", e.target.value)}
                                  className="w-full h-10 text-center bg-white rounded border-0 text-sm font-semibold"
                                />

                                <input
                                  {...createInputProps(ej.id!, sidx, "peso")}
                                  type="number"
                                  inputMode="decimal"
                                  placeholder="Kg"
                                  value={s.peso ?? ""}
                                  onChange={(e) => setSetValue(ej.id, sidx, "peso", e.target.value)}
                                  className="w-full h-10 text-center bg-white rounded border-0 text-sm font-semibold"
                                />

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => toggleFallo(ej.id, sidx)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border text-xs ${
                                      isFallo
                                        ? "bg-amber-300 border-amber-500 text-amber-900 font-bold"
                                        : "bg-white/70 border-slate-300 text-slate-700"
                                    }`}
                                    title={isFallo ? "Serie al fallo" : "Marcar serie al fallo"}
                                  >
                                    ⚡
                                  </button>
                                  <input
                                    {...createInputProps(ej.id!, sidx, "rirMin")}
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="RIR"
                                    value={isFallo ? "" : rirMin ?? ""}
                                    onChange={(e) =>
                                      setSetValue(ej.id, sidx, "rirMin", e.target.value)
                                    }
                                    disabled={isFallo}
                                    className={`w-12 h-10 text-center rounded border-0 text-sm font-semibold ${
                                      isFallo ? "bg-amber-50 text-amber-700" : "bg-white"
                                    }`}
                                  />
                                  <span className="text-slate-600 text-xs">-</span>
                                  <input
                                    {...createInputProps(ej.id!, sidx, "rirMax")}
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="RIR"
                                    value={isFallo ? "" : rirMax ?? ""}
                                    onChange={(e) =>
                                      setSetValue(ej.id, sidx, "rirMax", e.target.value)
                                    }
                                    disabled={isFallo}
                                    className={`w-12 h-10 text-center rounded border-0 text-sm font-semibold ${
                                      isFallo ? "bg-amber-50 text-amber-700" : "bg-white"
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSetNotesOpen((prev) => {
                                        const exerciseId = ej.id!;
                                        const prevForExercise = prev[exerciseId] || {};
                                        return {
                                          ...prev,
                                          [exerciseId]: {
                                            ...prevForExercise,
                                            [sidx]: !prevForExercise[sidx],
                                          },
                                        };
                                      });
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white/70 hover:bg-white border border-slate-300 text-xs"
                                    title="Notas de esta serie"
                                  >
                                    💬
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const hasReps = !!(s.reps && s.reps.toString().trim());
                                      const hasPeso = !!(s.peso && s.peso.toString().trim());
                                      const hasRir = !!(s.rir && s.rir.toString().trim());
                                      const hasNote = !!(s.note && s.note.toString().trim());
                                      const hasFallo = s.fallo === true;
                                      const hasData = hasReps || hasPeso || hasRir || hasNote || hasFallo;

                                      if (hasData) {
                                        const ok = confirm(
                                          "¿Eliminar esta serie? Los datos de esta serie se perderán."
                                        );
                                        if (!ok) return;
                                      }

                                      removeSet(ej.id, sidx);
                                    }}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-white/70 hover:bg-white border border-slate-300 text-xs text-slate-700"
                                    title="Eliminar serie"
                                  >
                                    🗑
                                  </button>
                                </div>
                              </div>
                              {setNoteOpen && (
                                <div className="mt-1">
                                  <textarea
                                    className="w-full text-[11px] bg-white/80 border border-slate-300 rounded-md p-1.5 resize-none"
                                    rows={2}
                                    value={s.note ?? ""}
                                    onChange={(e) => setSetNote(ej.id!, sidx, e.target.value)}
                                    placeholder="Nota rápida para esta serie..."
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        <button
                          onClick={() => {
                            setSelectorOpen({
                              open: true,
                              targetId: ej.id,
                              grupo: ej.grupo,
                              mode: "replace",
                            });
                          }}
                          className="px-3 py-2 text-xs bg-white/70 rounded border border-slate-400"
                        >
                          🔄 Reemplazar
                        </button>
                      </div>
                    </div>

                    {isExerciseNoteOpen && (
                      <div className="mt-3">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Notas del ejercicio
                        </label>
                        <textarea
                          className="w-full text-xs bg-white/80 border border-slate-300 rounded-md p-2 resize-none"
                          rows={3}
                          value={exerciseNote}
                          onChange={(e) => setExerciseNote(ej.id!, e.target.value)}
                          placeholder="Escribí aquí tus notas para este ejercicio..."
                        />
                      </div>
                    )}

                    <div className="flex gap-2 justify-center pt-2">
                      <button
                        onClick={() => moveExercise(selectedDay, ej.id!, "up")}
                        className="px-3 py-1 text-xs bg-white/70 rounded border border-slate-400"
                        disabled={idx === 0}
                      >
                        ↑ Subir
                      </button>
                      <button
                        onClick={() => moveExercise(selectedDay, ej.id!, "down")}
                        className="px-3 py-1 text-xs bg-white/70 rounded border border-slate-400"
                        disabled={idx === day.ejercicios.length - 1}
                      >
                        ↓ Bajar
                      </button>
                      <button
                        onClick={() => {
                          if (!confirm("¿Eliminar ejercicio de la rutina?")) return;
                          removeExercise(selectedDay, ej.id!);
                        }}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-slate-800 rounded-lg p-3 mb-3 border border-slate-700 print:bg-white mx-2">
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
                  {ab.series} × {ab.reps}
                </div>
              </div>
            ))}
          </div>
        </div>

        <details className="bg-slate-800 rounded-lg p-3 border border-slate-700 print:bg-white mx-2">
          <summary className="text-sm font-bold text-white cursor-pointer print:text-slate-900">
            📋 Notas Técnicas (click para expandir)
          </summary>
          <div className="grid md:grid-cols-2 gap-3 text-slate-300 print:text-slate-800 mt-3 text-xs">
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                Progresión de Reps
              </h4>
              <p>
                8-10 / 9-11 / 10-12 = progresión semanal. Al completar semana 3, subir peso y volver
                a 8-10.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                Back-off Sets
              </h4>
              <p>Reducir ~10% el peso en las series finales para mantener calidad técnica.</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-1 print:text-blue-700">
                Tempo (ej: 1-0-3-1)
              </h4>
              <p>1s excéntrico – 0s pausa abajo – 3s concéntrico – 1s pausa arriba.</p>
            </div>
          </div>
        </details>

        <div className="text-center text-slate-400 text-[10px] mt-3 print:text-slate-700 px-2">
          <p>83kg | 1.75m | 23 años | Hipertrofia + Estética</p>
        </div>

        <div
          className={`fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700 safe-area-bottom z-40 transition-all duration-300 translate-y-0`}
        >
          <div className="p-2">
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={finalizarSesion}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold text-xs transition-all active:scale-95"
              >
                ✓ FINALIZAR
              </button>

              <button
                onClick={() => setSelectorOpen({ open: true, mode: "add", grupo: undefined })}
                className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                title="Agregar ejercicio"
              >
                +
              </button>

              <button
                onClick={copiarDiaCompleto}
                className="w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                title="Copiar día"
              >
                📋
              </button>

              <button
                onClick={async () => {
                  const tabla = generarTablaParaSheets();
                  try {
                    await navigator.clipboard.writeText(tabla);
                    alert("✅ Tabla copiada");
                  } catch {
                    const ta = document.createElement("textarea");
                    ta.value = tabla;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand("copy");
                    document.body.removeChild(ta);
                    alert("✅ Tabla copiada");
                  }
                }}
                className="w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                title="Exportar a Sheets"
              >
                📑
              </button>
            </div>
          </div>
        </div>

        <div className="h-16"></div>
      </div>

      {selectorOpen.open && (
        <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 p-0 md:items-center md:p-4">
          <div
            className="bg-slate-900 rounded-t-3xl md:rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-slate-700 md:max-h-[80vh]"
            style={{
              boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-900 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">💪 Seleccionar Ejercicio</h3>
                <button
                  onClick={() => setSelectorOpen({ open: false })}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-white text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-center mt-2 md:hidden">
                <div className="w-12 h-1 bg-slate-600 rounded-full"></div>
              </div>
            </div>

            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Buscar ejercicio (mín. 2 caracteres)..."
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  autoComplete="off"
                  type="text"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                    aria-label="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {suggestions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No se encontraron ejercicios</div>
              ) : (
                <div className="p-2 space-y-2">
                  {suggestions.map((sug) => (
                    <button
                      key={sug.id || sug.nombre}
                      onClick={() => handleSelectSuggestion(sug)}
                      className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm mb-1">{sug.nombre}</div>
                          <div className="text-xs text-slate-300">
                            {sug.series} series • {sug.reps} reps
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            colorLegend[sug.grupo].bg
                          } ${colorLegend[sug.grupo].text}`}
                        >
                          {sug.grupo}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700 sticky bottom-0 bg-slate-900">
              <button
                onClick={() => setSelectorOpen({ open: false })}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
      body {
        margin: 0;
        padding: 0;
        background-color: #0f172a;
      }
      
      @supports (padding-top: env(safe-area-inset-top)) {
        body {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
      }
      
      html, body, #root {
        background-color: #0f172a;
        margin: 0;
        padding: 0;
      }
  @media print {
    * { box-shadow: none !important; }
    a, button { display: none !important; }
  }
  
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  .safe-area-top {
    padding-top: max(12px, env(safe-area-inset-top));
  }

  .safe-area-bottom {
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }

  @media (max-width: 768px) {
    .overflow-x-auto {
      -webkit-overflow-scrolling: touch;
    }
  }

  @supports (padding-top: env(safe-area-inset-top)) {
    :root { --safe-top: env(safe-area-inset-top); }
  }
  @keyframes swipeIndicator {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
  
  .animate-pulse-swipe {
    animation: swipeIndicator 1.5s ease-in-out infinite;
  }
  
  button:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
  
  html {
    scroll-behavior: smooth;
  }

@media (max-width: 768px) {
  .modal-bottom-sheet {
    animation: slideUp 0.3s ease-out;
  }
  
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
}

.modal-content {
  -webkit-overflow-scrolling: touch;
}

button {
  min-height: 44px;
  min-width: 44px;
}

@media (max-width: 768px) {
  input, textarea {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .grid-cols-\\[auto_1fr_1fr_auto\\] {
    grid-template-columns: auto 1fr 1fr auto;
    max-width: 100%;
    overflow: hidden;
  }
}
`}</style>
    </div>
  );
};

export default RutinaGym;
