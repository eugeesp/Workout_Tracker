import React, { useEffect, useMemo, useState } from "react";
import { Download, Info, Printer, BarChart3 } from "lucide-react";

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
  id?: string; // se genera si no viene
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

const STORAGE_DONE = "rg-done-v1" as const; // peso/reps reales por ejercicio

const RutinaGym: React.FC = () => {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_DONE);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [logs, setLogs] = useState<
    Record<string, { peso?: string; reps?: string }>
  >(() => {
    try {
      const raw = localStorage.getItem(STORAGE_LOGS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [selectedDay, setSelectedDay] = useState<keyof typeof rutina>(
    (localStorage.getItem("rg-selectedDay") as keyof typeof rutina) || "lunes"
  );

  useEffect(() => {
    localStorage.setItem("rg-selectedDay", selectedDay);
  }, [selectedDay]);

  // Persistencia de completados
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DONE, JSON.stringify(done));
    } catch {}
  }, [done]);
  // Persistencia de logs (peso/reps)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOGS, JSON.stringify(logs));
    } catch {}
  }, [logs]);

  // Añadimos IDs únicas por día
  const rutinaConIds = useMemo(() => {
    return Object.fromEntries(
      dias.map((d) => [d, withIds(rutina[d], d)])
    ) as typeof rutina;
  }, []);

  // Resumen de volumen semanal por grupo (min–max series)
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
      data.ejercicios.forEach((ej, idx) => {
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

    // BOM para compatibilidad con Excel
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

  const handlePrint = () => window.print();

  // Copiar resumen de día al portapapeles (para Notas/WhatsApp)
  const copiarResumen = async (dia: keyof typeof rutina, data: DiaRutina) => {
    const lineas: string[] = [];
    lineas.push(`${data.nombre}`);
    lineas.push("");

    data.ejercicios.forEach((ej, i) => {
      const idx = `E${i + 1}`;
      lineas.push(
        `${idx} ${ej.nombre}: ___ kg  |  Reps: ___  |  RPE objetivo: ${ej.rpe}`
      );
    });

    lineas.push("");
    lineas.push("Notas rápidas: ____________________________");

    // 👇 la línea que causaba el error está corregida acá
    const texto = lineas.join("\n");

    try {
      await navigator.clipboard.writeText(texto);
      alert("Resumen copiado. Pegalo en Notas/WhatsApp ✅");
    } catch {
      // Fallback si el navegador bloquea el Clipboard API
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
  };

  const completedCount = day.ejercicios.reduce(
    (acc, e) => acc + (isDone(e.id) ? 1 : 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-6 border border-slate-700 print:shadow-none print:border-0 print:bg-white print:p-0">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white print:text-slate-900 mb-2">
                💪 Rutina de Hipertrofia
              </h1>
              <p className="text-slate-300 print:text-slate-700">
                5 días | Enfoque: Hipertrofia + Estética
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition print:hidden"
              >
                <Download size={18} />
                Exportar CSV
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition print:hidden"
              >
                <Printer size={18} />
                Imprimir
              </button>
              <button
                onClick={() => copiarResumen(selectedDay, day)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition print:hidden"
              >
                Copiar a Notas
              </button>
            </div>
          </div>

          {/* Leyenda de colores */}
          <div className="bg-slate-700 rounded-lg p-4 print:hidden">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Info size={18} /> Código de Colores por Grupo Muscular
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(colorLegend).map(([key, value]) => (
                <div
                  key={key}
                  className={`${value.bg} ${value.border} border-2 rounded px-3 py-1.5 text-center`}
                >
                  <span className={`${value.text} font-medium capitalize`}>
                    {key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen volumen semanal */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-6 border border-slate-700 print:border-0 print:shadow-none print:bg-white">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-white" size={18} />
            <h3 className="text-white font-semibold text-lg print:text-slate-900">
              Volumen semanal por grupo (series mín–máx)
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...volumenSemanal.entries()].map(([grupo, { min, max }]) => (
              <div
                key={grupo}
                className={`rounded-lg p-3 border ${colorLegend[grupo].border} ${colorLegend[grupo].bg}`}
              >
                <div
                  className={`text-sm font-semibold ${colorLegend[grupo].text} capitalize`}
                >
                  {grupo}
                </div>
                <div className="text-slate-700 font-mono">
                  {min === max ? min : `${min}–${max}`} series
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selector de días */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 print:hidden">
          {dias.map((dia) => (
            <button
              key={dia}
              onClick={() => setSelectedDay(dia)}
              aria-pressed={selectedDay === dia}
              className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                selectedDay === dia
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {dia.charAt(0).toUpperCase() + dia.slice(1)}
            </button>
          ))}
        </div>

        {/* Tabla de ejercicios */}
        <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 print:border-0 print:shadow-none print:bg-white">
          <div className="bg-slate-700 p-4 border-b border-slate-600 print:bg-white print:text-slate-900 print:border-b">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-white print:text-slate-900">
                {day.nombre}
              </h2>
              <div className="flex items-center gap-2 print:hidden">
                <span className="text-xs bg-slate-800 text-slate-200 px-2 py-1 rounded-lg border border-slate-600">
                  {completedCount}/{day.ejercicios.length} completados
                </span>
                <button
                  onClick={resetDay}
                  className="text-xs bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded-md border border-slate-500"
                  title="Borrar checks del día"
                >
                  Reset día
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead className="bg-slate-700 print:bg-slate-100">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-slate-300 print:text-slate-800"
                  >
                    ✓
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-sm font-semibold text-slate-300 print:text-slate-800"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-slate-300 print:text-slate-800"
                  >
                    Ejercicio
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-sm font-semibold text-slate-300 print:text-slate-800"
                  >
                    Series
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-sm font-semibold text-slate-300 print:text-slate-800"
                  >
                    Reps Objetivo
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-sm font-semibold text-slate-300 print:text-slate-800"
                  >
                    RPE
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-sm font-semibold text-slate-300 print:text-slate-800"
                  >
                    Tempo
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-slate-300 print:text-slate-800"
                  >
                    Notas
                  </th>
                </tr>
              </thead>
              <tbody>
                {day.ejercicios.map((ej, idx) => {
                  const colors = colorLegend[ej.grupo];
                  const rowIndex = idx + 1;
                  const checked = isDone(ej.id);
                  return (
                    <tr
                      key={ej.id}
                      className={`${colors.bg} border-b-2 ${colors.border} hover:opacity-80 transition print:hover:opacity-100`}
                    >
                      <td className="px-4 py-4 align-middle">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDone(ej.id)}
                          className="w-5 h-5 accent-blue-600"
                          aria-label={`Marcar ${ej.nombre} como completado`}
                        />
                      </td>
                      <td className="px-2 py-4 font-mono font-bold text-slate-700">{`E${rowIndex}`}</td>
                      <td className={`px-4 py-4 font-semibold ${colors.text}`}>
                        {ej.nombre}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-slate-700">
                        {ej.series}
                      </td>
                      <td className="px-4 py-4 text-center font-mono text-slate-700">
                        {ej.reps}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-slate-700">
                        {ej.rpe}
                      </td>
                      <td className="px-4 py-4 text-center font-mono text-sm text-slate-600">
                        {ej.tempo || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 italic">
                        {ej.nota || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Abdominales */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mt-6 border border-slate-700 print:border-0 print:shadow-none print:bg-white">
          <h3 className="text-xl font-bold text-white mb-4 print:text-slate-900">
            🔥 Abdominales (día intercalado / opcional)
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {abdominales.map((ab, idx) => (
              <div
                key={idx}
                className="bg-slate-700 rounded-lg p-4 border-l-4 border-indigo-500 print:bg-white print:border print:border-indigo-200"
              >
                <h4 className="font-semibold text-white mb-2 print:text-slate-900">
                  {ab.nombre}
                </h4>
                <div className="text-slate-300 text-sm space-y-1 print:text-slate-800">
                  <p>
                    <span className="font-semibold">Series:</span> {ab.series}
                  </p>
                  <p>
                    <span className="font-semibold">Reps:</span> {ab.reps}
                  </p>
                  <p>
                    <span className="font-semibold">RPE:</span> {ab.rpe}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas técnicas */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mt-6 border border-slate-700 print:border-0 print:shadow-none print:bg-white">
          <h3 className="text-xl font-bold text-white mb-4 print:text-slate-900">
            📋 Notas Técnicas
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-slate-300 print:text-slate-800">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2 print:text-blue-700">
                Progresión de Reps
              </h4>
              <p className="text-sm">
                Los rangos 8-10 / 9-11 / 10-12 indican progresión semanal.
                Semana 1: 8-10 reps, Semana 2: 9-11, Semana 3: 10-12. Al
                completar semana 3, aumentar peso y volver a 8-10.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2 print:text-blue-700">
                Back-off Sets
              </h4>
              <p className="text-sm">
                Reducir ~10% el peso en las series finales para mantener calidad
                técnica y volumen efectivo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2 print:text-blue-700">
                Tempo (ej: 1-0-3-1)
              </h4>
              <p className="text-sm">
                1s excéntrico – 0s pausa abajo – 3s concéntrico – 1s pausa
                arriba. Enfatiza control y conexión mente-músculo.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2 print:text-blue-700">
                RPE (Rate of Perceived Exertion)
              </h4>
              <p className="text-sm">
                Escala de esfuerzo 1–10. RPE 7 ≈ 3 reps en recámara; RPE 8 ≈ 2
                reps en recámara. Evitar el fallo.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm mt-8 print:text-slate-700 print:mt-4">
          <p>
            Perfil: 83kg | 1.75m | 23 años | Objetivo: Hipertrofia + Estética |
            Fase: Volumen Ligero
          </p>
        </div>
      </div>

      {/* Estilos de impresión mínimos */}
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
