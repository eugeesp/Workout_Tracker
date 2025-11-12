import React, { useMemo, useState } from "react";

// =======================
// Tipos
// =======================

type Grupo = "pecho" | "espalda" | "biceps" | "triceps" | "hombro" | "pierna" | "activacion";
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

// =======================
// Datos de la rutina (igual que antes)
// =======================

const rutina: Record<"lunes" | "martes" | "miercoles" | "jueves" | "viernes", DiaRutina> = {
  lunes: {
    nombre: "LUNES - Pecho / Bíceps / Posterior 💪",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (polea alta unilateral)",
        series: 1, reps: "15-20", rpe: "4-5", tempo: "1-0-3-2", grupo: "activacion",
      },
      {
        nombre: "Press banca (barra plano)", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7-8", 
        tempo: "2-0-3-0", nota: "back-off", grupo: "pecho",
      },
      {
        nombre: "Press inclinado (barra)", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7-8", 
        nota: "back-off", grupo: "pecho",
      },
      {
        nombre: "Cruce de poleas (pecho)", series: 4, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "pecho",
      },
      {
        nombre: "Curl bíceps barra W", series: 3, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "biceps",
      },
      {
        nombre: "Curl bíceps alternado", series: 4, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "biceps",
      },
      {
        nombre: "Face pull (cuerda)", series: 4, reps: "12-15 → 15-20", rpe: "7", 
        tempo: "1-1-3-1", grupo: "hombro",
      },
    ],
  },
  martes: {
    nombre: "MARTES - Espalda / Tríceps / Posterior 💪",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (polea alta unilateral)",
        series: 1, reps: "15-20", rpe: "4-5", tempo: "1-0-3-2", grupo: "activacion",
      },
      {
        nombre: "Remo con barra (pesado)", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7-8", 
        nota: "back-off", grupo: "espalda",
      },
      {
        nombre: "Jalón neutro (agarre paralelo)", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7-8", 
        nota: "espalda alta", grupo: "espalda",
      },
      {
        nombre: "Jalón prono al pecho", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7", 
        nota: "control excéntrico", grupo: "espalda",
      },
      {
        nombre: "Extensión tríceps soga", series: 4, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "triceps",
      },
      {
        nombre: "Press francés (barra W)", series: "3-4", reps: "12-15", rpe: "7", 
        nota: "codos fijos", grupo: "triceps",
      },
      {
        nombre: "Peck-deck reverse", series: 4, reps: "12-15 → 15-20", rpe: "7", 
        tempo: "1-0-3-2", grupo: "hombro",
      },
    ],
  },
  miercoles: {
    nombre: "MIÉRCOLES - Pierna / Deltoides Medio / Posterior 🦵",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (polea alta unilateral)",
        series: 1, reps: "15-20", rpe: "4-5", tempo: "1-0-3-2", grupo: "activacion",
      },
      {
        nombre: "Sentadilla (barra)", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7-8", 
        nota: "back-off", grupo: "pierna",
      },
      {
        nombre: "Hack squat", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7-8", 
        nota: "back-off", grupo: "pierna",
      },
      {
        nombre: "Curl femoral acostado", series: 4, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "pierna",
      },
      {
        nombre: "Extensión cuádriceps", series: 4, reps: "12-15", rpe: "7", 
        nota: "pausa", grupo: "pierna",
      },
      {
        nombre: "Elevación lateral (polea)", series: 4, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "hombro",
      },
      {
        nombre: "Posterior polea cruzada (unilateral)", series: 4, reps: "12-15 → 15-20", rpe: "7", 
        tempo: "1-0-3-2", grupo: "hombro",
      },
    ],
  },
  jueves: {
    nombre: "JUEVES - Tren Superior (Push + Pull) 💪",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (micro)",
        series: 1, reps: "10-15", rpe: "3-4", nota: "solo MMC", grupo: "activacion",
      },
      {
        nombre: "Press inclinado (mancuernas)", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7", 
        nota: "back-off", grupo: "pecho",
      },
      {
        nombre: "Remo T / Hammer (controlado)", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7", 
        tempo: "2-1-3-1", nota: "enfoque MMC / escápula", grupo: "espalda",
      },
      {
        nombre: "Press militar (barra)", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7-8", 
        nota: "controlado", grupo: "hombro",
      },
      {
        nombre: "Jalón al pecho", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7", 
        nota: "lat stretch", grupo: "espalda",
      },
      {
        nombre: "Curl bíceps (variante libre)", series: 3, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "biceps",
      },
      {
        nombre: "Extensión tríceps unilateral", series: "3-4", reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "triceps",
      },
    ],
  },
  viernes: {
    nombre: "VIERNES - Pierna / Hombro (medio + posterior) 🦵",
    ejercicios: [
      {
        nombre: "Activación deltoides posterior (polea alta unilateral)",
        series: 1, reps: "15-20", rpe: "4-5", tempo: "1-0-3-2", grupo: "activacion",
      },
      {
        nombre: "Peso muerto rumano", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7-8", 
        nota: "back-off", grupo: "pierna",
      },
      {
        nombre: "Prensa 45°", series: 3, reps: "8-10 / 9-11 / 10-12", rpe: "7-8", 
        nota: "back-off", grupo: "pierna",
      },
      {
        nombre: "Curl femoral (acostado o sentado)", series: 4, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "pierna",
      },
      {
        nombre: "Extensión cuádriceps", series: 4, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "pierna",
      },
      {
        nombre: "Elevación lateral (polea)", series: 4, reps: "12-15", rpe: "7", 
        tempo: "1-0-3-1", grupo: "hombro",
      },
      {
        nombre: "Pájaros / reverse fly banco inclinado", series: 4, reps: "12-15 → 15-20", rpe: "7", 
        tempo: "1-0-3-2", grupo: "hombro",
      },
    ],
  },
};

const dias: Array<keyof typeof rutina> = ["lunes", "martes", "miercoles", "jueves", "viernes"];

// =======================
// Componente SUPER SIMPLE
// =======================

const RutinaGym: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<keyof typeof rutina>("lunes");

  const rutinaConIds = useMemo(() => {
    return Object.fromEntries(
      dias.map((d) => [d, {
        ...rutina[d],
        ejercicios: rutina[d].ejercicios.map((e, i) => ({ ...e, id: `${d}-E${i + 1}` }))
      }])
    ) as typeof rutina;
  }, []);

  const day = rutinaConIds[selectedDay];

  // FUNCIÓN PRINCIPAL: Copiar rutia limpia al portapapeles
  const copiarRutinaDia = async () => {
    const lineas: string[] = [];
    
    // Header del día
    lineas.push(`🏋️ ${day.nombre}`);
    lineas.push("");
    
    // Ejercicios
    day.ejercicios.forEach((ej, i) => {
      const numero = i + 1;
      lineas.push(`${numero}. ${ej.nombre}`);
      lineas.push(`   Series: ${ej.series} | Reps: ${ej.reps} | RPE: ${ej.rpe}`);
      if (ej.tempo) lineas.push(`   Tempo: ${ej.tempo}`);
      if (ej.nota) lineas.push(`   💡 ${ej.nota}`);
      lineas.push("");
    });
    
    // Notas generales
    lineas.push("📝 Notas del entrenamiento:");
    lineas.push("____________________________");
    lineas.push("");
    lineas.push("💧 Hidratación: _______");
    lineas.push("💤 Descanso: _______");
    lineas.push("🍎 Nutrición: _______");
    
    const texto = lineas.join("\n");

    try {
      await navigator.clipboard.writeText(texto);
      alert("✅ Rutina copiada al portapapeles!\n\nPegala en Notas de iOS y completa tus pesos durante el entrenamiento.");
    } catch {
      // Fallback para navegadores que no soportan clipboard
      const textarea = document.createElement("textarea");
      textarea.value = texto;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("✅ Rutina copiada!\n\nPegala en Notas de iOS.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        
        {/* Header simple */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            💪 Mi Rutina Gym
          </h1>
          <p className="text-gray-600">Seleccioná el día y copiá la rutia</p>
        </div>

        {/* Selector de días */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {dias.map((dia) => (
            <button
              key={dia}
              onClick={() => setSelectedDay(dia)}
              className={`px-4 py-3 rounded-lg font-semibold transition whitespace-nowrap flex-1 min-w-[80px] ${
                selectedDay === dia
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              {dia.charAt(0).toUpperCase() + dia.slice(1)}
            </button>
          ))}
        </div>

        {/* Botón principal - COPY */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              {day.nombre}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              {day.ejercicios.length} ejercicios
            </p>
            <button
              onClick={copiarRutinaDia}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition shadow-md"
            >
              📋 COPIAR RUTINA
            </button>
            <p className="text-gray-500 text-xs mt-3">
              Se copiará al portapapeles para pegarlo en Notas de iOS
            </p>
          </div>
        </div>

        {/* Vista previa rápida */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Vista previa:</h3>
          <div className="space-y-3 text-sm">
            {day.ejercicios.slice(0, 3).map((ej, i) => (
              <div key={ej.id} className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-800">{ej.nombre}</p>
                  <p className="text-gray-600 text-xs">
                    {ej.series}×{ej.reps} | RPE {ej.rpe}
                  </p>
                </div>
              </div>
            ))}
            {day.ejercicios.length > 3 && (
              <p className="text-gray-500 text-xs text-center">
                ... y {day.ejercicios.length - 3} ejercicios más
              </p>
            )}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>👆 Seleccioná el día → 📋 Copiá → 📱 Pegá en Notas de iOS</p>
          <p className="mt-1">💡 Completá los pesos directamente en Notas durante el entrenamiento</p>
        </div>

      </div>
    </div>
  );
};

export default RutinaGym;