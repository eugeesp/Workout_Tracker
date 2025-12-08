import { Ejercicio } from "../types";

export const ejerciciosDB: Ejercicio[] = [
  // === PECHO ===
{
  id: "press-banca-barra-plano",
  nombre: "Press banca (barra plano)",
  grupo: "pecho",
  series: 3,
  reps: "6-10",
},
{
  id: "press-banca-inclinado-barra",
  nombre: "Press inclinado (barra)",
  grupo: "pecho",
  series: 3,
  reps: "8-10",
},
{
  id: "press-banca-declinado-barra",
  nombre: "Press declinado (barra)",
  grupo: "pecho",
  series: 3,
  reps: "8-10",
},

{
  id: "press-mancuernas-plano",
  nombre: "Press con mancuernas (plano)",
  grupo: "pecho",
  series: 3,
  reps: "8-12",
},
{
  id: "press-mancuernas-inclinado",
  nombre: "Press con mancuernas (inclinado)",
  grupo: "pecho",
  series: 3,
  reps: "8-12",
},
{
  id: "press-mancuernas-declinado",
  nombre: "Press con mancuernas (declinado)",
  grupo: "pecho",
  series: 3,
  reps: "8-12",
},

{
  id: "press-maquina-plano",
  nombre: "Press en máquina (plano)",
  grupo: "pecho",
  series: 3,
  reps: "10-15",
},
{
  id: "press-maquina-inclinado",
  nombre: "Press en máquina (inclinado)",
  grupo: "pecho",
  series: 3,
  reps: "10-15",
},
{
  id: "press-maquina-declinado",
  nombre: "Press en máquina (declinado)",
  grupo: "pecho",
  series: 3,
  reps: "10-15",
},
{
  id: "press-hammer-plano",
  nombre: "Press Hammer (plano)",
  grupo: "pecho",
  series: 3,
  reps: "8-12",
},
{
  id: "press-hammer-inclinado",
  nombre: "Press Hammer (inclinado)",
  grupo: "pecho",
  series: 3,
  reps: "8-12",
},

// --- Aperturas y aislación ---
{
  id: "aperturas-mancuernas-plano",
  nombre: "Aperturas con mancuernas (plano)",
  grupo: "pecho",
  series: 3,
  reps: "12-15",
},
{
  id: "aperturas-mancuernas-inclinado",
  nombre: "Aperturas con mancuernas (inclinado)",
  grupo: "pecho",
  series: 3,
  reps: "12-15",
},
{
  id: "aperturas-mancuernas-declinado",
  nombre: "Aperturas con mancuernas (declinado)",
  grupo: "pecho",
  series: 3,
  reps: "12-15",
},

{
  id: "cruce-poleas-alto",
  nombre: "Cruce en poleas (desde arriba)",
  grupo: "pecho",
  series: 3,
  reps: "12-20",
},
{
  id: "cruce-poleas-medio",
  nombre: "Cruce en poleas (medio)",
  grupo: "pecho",
  series: 3,
  reps: "12-20",
},
{
  id: "cruce-poleas-bajo",
  nombre: "Cruce en poleas (desde abajo)",
  grupo: "pecho",
  series: 3,
  reps: "12-20",
},

{
  id: "aperturas-polea-baja-unilateral",
  nombre: "Aperturas en polea baja (unilateral)",
  grupo: "pecho",
  series: 3,
  reps: "12-20",
},
{
  id: "aperturas-polea-alta-unilateral",
  nombre: "Aperturas en polea alta (unilateral)",
  grupo: "pecho",
  series: 3,
  reps: "12-20",
},

{
  id: "peck-deck",
  nombre: "Peck deck",
  grupo: "pecho",
  series: 3,
  reps: "12-15",
},
{
  id: "pec-deck-unilateral",
  nombre: "Peck deck (unilateral)",
  grupo: "pecho",
  series: 3,
  reps: "12-20",
},

// --- Ejercicios con peso corporal ---
{
  id: "fondos-paralelas-pecho",
  nombre: "Fondos en paralelas (pecho)",
  grupo: "pecho",
  series: 3,
  reps: "8-12",
},
{
  id: "pushups",
  nombre: "Push-ups (flexiones)",
  grupo: "pecho",
  series: 3,
  reps: "10-20",
},
{
  id: "pushups-inclinadas",
  nombre: "Push-ups inclinadas",
  grupo: "pecho",
  series: 3,
  reps: "12-20",
},
{
  id: "pushups-declinadas",
  nombre: "Push-ups declinadas",
  grupo: "pecho",
  series: 3,
  reps: "10-20",
},

// --- Variantes avanzadas / cableo específico ---
{
  id: "press-cable-plano",
  nombre: "Press con cables (plano)",
  grupo: "pecho",
  series: 3,
  reps: "12-15",
},
{
  id: "press-cable-inclinado",
  nombre: "Press con cables (inclinado)",
  grupo: "pecho",
  series: 3,
  reps: "12-15",
},
{
  id: "guillotine-press-barra",
  nombre: "Press guillotina (barra)",
  grupo: "pecho",
  series: 3,
  reps: "8-10",
},
{
  id: "squeeze-press",
  nombre: "Squeeze press (mancuernas)",
  grupo: "pecho",
  series: 3,
  reps: "10-15",
},
{
  id: "isometria-press-pecho",
  nombre: "Isometría de pecho (máquina o polea)",
  grupo: "pecho",
  series: 3,
  reps: "20-30s",
},

 // === ESPALDA ===
{
  id: "remo-barra-pendlay",
  nombre: "Remo con barra (Pendlay)",
  grupo: "espalda",
  series: 3,
  reps: "5-8",
},
{
  id: "remo-barra-clasico",
  nombre: "Remo con barra",
  grupo: "espalda",
  series: 3,
  reps: "8-10",
},
{
  id: "remo-barra-yates",
  nombre: "Remo Yates (barra)",
  grupo: "espalda",
  series: 3,
  reps: "8-12",
},

{
  id: "remo-mancuerna-unilateral",
  nombre: "Remo con mancuerna (unilateral)",
  grupo: "espalda",
  series: 3,
  reps: "8-12",
},
{
  id: "remo-mancuerna-banco-inclinado",
  nombre: "Remo con mancuernas en banco inclinado",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},

{
  id: "remo-hammer",
  nombre: "Remo en máquina Hammer",
  grupo: "espalda",
  series: 3,
  reps: "8-12",
},
{
  id: "remo-maquina-sentado",
  nombre: "Remo sentado en máquina",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},
{
  id: "remo-bajo-cable",
  nombre: "Remo bajo en cable",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},
{
  id: "remo-bajo-cable-unilateral",
  nombre: "Remo bajo en cable (unilateral)",
  grupo: "espalda",
  series: 3,
  reps: "12-15",
},

{
  id: "pulldown-prono",
  nombre: "Jalón prono al pecho",
  grupo: "espalda",
  series: 3,
  reps: "8-12",
},
{
  id: "pulldown-supino",
  nombre: "Jalón supino al pecho",
  grupo: "espalda",
  series: 3,
  reps: "8-12",
},
{
  id: "pulldown-neutro",
  nombre: "Jalón neutro",
  grupo: "espalda",
  series: 3,
  reps: "8-12",
},
{
  id: "pulldown-agarre-paralelo",
  nombre: "Jalón agarre paralelo",
  grupo: "espalda",
  series: 3,
  reps: "8-12",
},

{
  id: "dominadas-prono",
  nombre: "Dominadas (agarre prono)",
  grupo: "espalda",
  series: 3,
  reps: "6-10",
},
{
  id: "dominadas-supino",
  nombre: "Dominadas (agarre supino)",
  grupo: "espalda",
  series: 3,
  reps: "6-12",
},
{
  id: "dominadas-neutro",
  nombre: "Dominadas (agarre neutro)",
  grupo: "espalda",
  series: 3,
  reps: "6-12",
},

{
  id: "remo-t-bar",
  nombre: "Remo T-Bar",
  grupo: "espalda",
  series: 3,
  reps: "8-12",
},
{
  id: "remo-t-bar-unilateral",
  nombre: "Remo T-Bar unilateral",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},

{
  id: "pull-over-mancuerna",
  nombre: "Pullover con mancuerna",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},
{
  id: "pull-over-cable",
  nombre: "Pullover en polea",
  grupo: "espalda",
  series: 3,
  reps: "12-20",
},

{
  id: "lat-pulldown-angular",
  nombre: "Jalón al pecho (ángulo medio)",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},
{
  id: "lat-pulldown-estiramiento",
  nombre: "Jalón al pecho con énfasis en estiramiento",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},

// Máquina específica
{
  id: "maquina-lat-iso",
  nombre: "Lat machine ISO lateral independiente",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},
{
  id: "maquina-remada-alta",
  nombre: "Remada alta en máquina",
  grupo: "espalda",
  series: 3,
  reps: "12-15",
},

// Variantes avanzadas
{
  id: "kneeling-lat-pulldown",
  nombre: "Lat pulldown rodillas en el suelo",
  grupo: "espalda",
  series: 3,
  reps: "12-15",
},
{
  id: "single-arm-lat-pulldown",
  nombre: "Lat pulldown unilateral",
  grupo: "espalda",
  series: 3,
  reps: "12-15",
},
{
  id: "single-arm-cable-row",
  nombre: "Remo en cable (unilateral, alto → bajo)",
  grupo: "espalda",
  series: 3,
  reps: "12-15",
},
{
  id: "chest-supported-row",
  nombre: "Remo en banco inclinado (chest supported row)",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},

// Trapecio medio/alto (parte de espalda)
{
  id: "facepull-espalda",
  nombre: "Face pull (espalda media/alta)",
  grupo: "espalda",
  series: 3,
  reps: "12-20",
},
{
  id: "reverse-fly-maquina",
  nombre: "Reverse fly en máquina",
  grupo: "espalda",
  series: 3,
  reps: "12-20",
},

// Estímulo de estiramiento (lats)
{
  id: "estiramiento-lat-polea",
  nombre: "Stretch lat pulldown",
  grupo: "espalda",
  series: 3,
  reps: "10-15",
},

  // === HOMBROS ===
  // DELTOIDES MEDIO (Lateral)
{
  id: "elevaciones-laterales-mancuernas",
  nombre: "Elevaciones laterales (mancuernas)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "elevaciones-laterales-polea",
  nombre: "Elevaciones laterales (polea baja)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "elevaciones-laterales-cable-unilateral",
  nombre: "Elevación lateral unilateral (cable)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "elevaciones-laterales-maquina",
  nombre: "Elevación lateral en máquina",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "elevaciones-laterales-mancuerna-parcial",
  nombre: "Elevaciones laterales parciales (pesado)",
  grupo: "hombro",
  series: 3,
  reps: "20-30",
},
{
  id: "laterales-sentado-mancuernas",
  nombre: "Elevación lateral sentado",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
  // DELTOIDES ANTERIOR (Frontal)
  {
  id: "elevaciones-frontales-mancuernas",
  nombre: "Elevaciones frontales (mancuernas)",
  grupo: "hombro",
  series: 3,
  reps: "10-15",
},
{
  id: "elevaciones-frontales-disco",
  nombre: "Elevación frontal con disco",
  grupo: "hombro",
  series: 3,
  reps: "10-15",
},
{
  id: "front-raise-cable",
  nombre: "Elevación frontal en cable",
  grupo: "hombro",
  series: 3,
  reps: "12-15",
},
{
  id: "press-frontal-barra",
  nombre: "Press frontal (barra, sentado o parado)",
  grupo: "hombro",
  series: 3,
  reps: "6-10",
},

// DELTOIDES POSTERIOR (Trasero)
{
  id: "posterior-maquina",
  nombre: "Deltoides posterior en máquina (reverse fly)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "posterior-polea-cruzada",
  nombre: "Posterior en polea cruzada (cable cross)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "posterior-polea-unilateral",
  nombre: "Deltoides posterior en polea (unilateral)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "posterior-mancuernas-inclinado",
  nombre: "Pájaros con mancuernas (banco inclinado)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "posterior-mancuernas-sentado",
  nombre: "Pájaros con mancuernas sentado",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "facepull",
  nombre: "Face pull",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "facepull-alto",
  nombre: "Face pull alto (enfocado en deltoides posterior)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},

  // PRESS DE HOMBRO (compuestos)
  {
  id: "press-militar-barra",
  nombre: "Press militar (barra)",
  grupo: "hombro",
  series: 3,
  reps: "6-10",
},
{
  id: "press-militar-mancuernas",
  nombre: "Press militar (mancuernas)",
  grupo: "hombro",
  series: 3,
  reps: "8-12",
},
{
  id: "press-hombro-maquina",
  nombre: "Press de hombro en máquina",
  grupo: "hombro",
  series: 3,
  reps: "8-12",
},
{
  id: "arnold-press",
  nombre: "Press Arnold",
  grupo: "hombro",
  series: 3,
  reps: "8-12",
},
{
  id: "landmine-press",
  nombre: "Landmine press",
  grupo: "hombro",
  series: 3,
  reps: "8-12",
},

// VARIANTES AVANZADAS
{
  id: "y-raise-inclinado",
  nombre: "Y-raise en banco inclinado",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "scaption-raise",
  nombre: "Elevación en escápula (scaption raise)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "posterior-band-pullapart",
  nombre: "Band pull-aparts",
  grupo: "hombro",
  series: 3,
  reps: "15-25",
},
{
  id: "lateral-lean-raise",
  nombre: "Elevación lateral con inclinación (polea o mancuerna)",
  grupo: "hombro",
  series: 3,
  reps: "12-20",
},
{
  id: "cuban-rotation",
  nombre: "Cuban rotation",
  grupo: "hombro",
  series: 3,
  reps: "10-15",
},


  // === BÍCEPS ===
 // CURLS BÁSICOS
 {
  id: "curl-barra-w",
  nombre: "Curl bíceps barra W",
  grupo: "biceps",
  series: 3,
  reps: "10-12",
},
{
  id: "curl-barra-recta",
  nombre: "Curl bíceps barra recta",
  grupo: "biceps",
  series: 3,
  reps: "8-12",
},
{
  id: "curl-mancuernas-alternado",
  nombre: "Curl bíceps alternado (mancuernas)",
  grupo: "biceps",
  series: 3,
  reps: "10-15",
},
{
  id: "curl-mancuernas-simultaneo",
  nombre: "Curl bíceps simultáneo (mancuernas)",
  grupo: "biceps",
  series: 3,
  reps: "10-15",
},
{
  id: "curl-brazo-a-brazo",
  nombre: "Curl bíceps a dos manos (mancuernas)",
  grupo: "biceps",
  series: 3,
  reps: "10-15",
},

// BANCO INCLINADO / TENSIÓN MÁXIMA EN ESTIRAMIENTO
{
  id: "curl-inclinado-mancuernas",
  nombre: "Curl inclinado (mancuernas, banco 45°)",
  grupo: "biceps",
  series: 3,
  reps: "8-12",
},
{
  id: "curl-supino-inclinado",
  nombre: "Curl supino inclinado",
  grupo: "biceps",
  series: 3,
  reps: "8-12",
},

// CURL EN MARTILLO
{
  id: "curl-martillo",
  nombre: "Curl martillo (hammer curl)",
  grupo: "biceps",
  series: 3,
  reps: "10-12",
},
{
  id: "curl-martillo-cruzado",
  nombre: "Curl martillo cruzado",
  grupo: "biceps",
  series: 3,
  reps: "10-12",
},
{
  id: "curl-martillo-inclinado",
  nombre: "Curl martillo inclinado",
  grupo: "biceps",
  series: 3,
  reps: "10-12",
},

// MAQUINARIA / POLEAS (tensión constante)
{
  id: "curl-polea-baja-barra",
  nombre: "Curl en polea baja (barra recta)",
  grupo: "biceps",
  series: 3,
  reps: "10-15",
},
{
  id: "curl-polea-baja-cuerda",
  nombre: "Curl en polea baja (cuerda)",
  grupo: "biceps",
  series: 3,
  reps: "10-15",
},
{
  id: "curl-polea-unilateral",
  nombre: "Curl bíceps en polea (unilateral)",
  grupo: "biceps",
  series: 3,
  reps: "12-15",
},
{
  id: "curl-maquina",
  nombre: "Curl de bíceps en máquina",
  grupo: "biceps",
  series: 3,
  reps: "10-15",
},

// CONCENTRACIÓN
{
  id: "curl-concentrado-mancuerna",
  nombre: "Curl concentrado (mancuerna)",
  grupo: "biceps",
  series: 3,
  reps: "10-12",
},
{
  id: "curl-concentrado-polea",
  nombre: "Curl concentrado (polea)",
  grupo: "biceps",
  series: 3,
  reps: "12-15",
},

// VARIANTES AVANZADAS
{
  id: "curl-predicador-barra",
  nombre: "Curl predicador (barra W o recta)",
  grupo: "biceps",
  series: 3,
  reps: "8-12",
},
{
  id: "curl-predicador-mancuerna",
  nombre: "Curl predicador unilateral (mancuerna)",
  grupo: "biceps",
  series: 3,
  reps: "10-12",
},
{
  id: "curl-spider",
  nombre: "Spider curl (banco inclinado)",
  grupo: "biceps",
  series: 3,
  reps: "10-12",
},
{
  id: "curl-tendido-prono",
  nombre: "Curl tendido prono (en banco inclinado)",
  grupo: "biceps",
  series: 3,
  reps: "10-12",
},




  // === TRÍCEPS ===
// === TRÍCEPS ===
{
  id: "extension-soga-polea",
  nombre: "Extensión de tríceps en polea (soga)",
  grupo: "triceps",
  series: 3,
  reps: "10-15",
},
{
  id: "extension-barra-polea",
  nombre: "Extensión de tríceps en polea (barra recta)",
  grupo: "triceps",
  series: 3,
  reps: "10-12",
},
{
  id: "extension-barra-w-polea",
  nombre: "Extensión de tríceps en polea (barra W)",
  grupo: "triceps",
  series: 3,
  reps: "10-12",
},
{
  id: "extension-unilateral-polea",
  nombre: "Extensión de tríceps unilateral (polea)",
  grupo: "triceps",
  series: 3,
  reps: "12-15",
},
{
  id: "press-frances-barra-w",
  nombre: "Press francés (barra W)",
  grupo: "triceps",
  series: 3,
  reps: "8-12",
},
{
  id: "press-frances-mancuerna",
  nombre: "Press francés (mancuerna, unilateral)",
  grupo: "triceps",
  series: 3,
  reps: "10-12",
},
{
  id: "press-frances-dos-manos",
  nombre: "Press francés (mancuerna, dos manos)",
  grupo: "triceps",
  series: 3,
  reps: "10-12",
},
{
  id: "triceps-copa",
  nombre: "Tríceps copa (mancuerna, 1 mano o 2 manos)",
  grupo: "triceps",
  series: 3,
  reps: "10-15",
},
{
  id: "fondos-banco",
  nombre: "Fondos en banco",
  grupo: "triceps",
  series: 3,
  reps: "12-15",
},
{
  id: "fondos-paralelas",
  nombre: "Fondos en paralelas",
  grupo: "triceps",
  series: 3,
  reps: "6-10",
},
{
  id: "patada-mancuerna",
  nombre: "Patada de tríceps (kickback, mancuerna)",
  grupo: "triceps",
  series: 3,
  reps: "12-15",
},
{
  id: "patada-polea",
  nombre: "Patada de tríceps (polea baja)",
  grupo: "triceps",
  series: 3,
  reps: "12-15",
},
{
  id: "press-agarre-cerrado",
  nombre: "Press banca agarre cerrado",
  grupo: "triceps",
  series: 3,
  reps: "6-10",
},
{
  id: "press-militar-cerrado",
  nombre: "Press militar agarre cerrado",
  grupo: "triceps",
  series: 3,
  reps: "6-10",
},
{
  id: "extension-tumba-barra",
  nombre: "Extensión de tríceps tumbado (barra EZ)",
  grupo: "triceps",
  series: 3,
  reps: "8-12",
},
{
  id: "extension-tumba-mancuernas",
  nombre: "Extensión de tríceps tumbado (mancuernas)",
  grupo: "triceps",
  series: 3,
  reps: "10-12",
},
{
  id: "jm-press",
  nombre: "JM Press",
  grupo: "triceps",
  series: 3,
  reps: "6-10",
},
{
  id: "triceps-cuerda-invertido",
  nombre: "Extensión de tríceps con cuerda (agarre invertido)",
  grupo: "triceps",
  series: 3,
  reps: "12-15",
},
{
  id: "triceps-overhead-cuerda",
  nombre: "Tríceps overhead en polea (cuerda)",
  grupo: "triceps",
  series: 3,
  reps: "10-12",
},
{
  id: "triceps-overhead-mancuerna",
  nombre: "Tríceps overhead unilateral (mancuerna)",
  grupo: "triceps",
  series: 3,
  reps: "10-12",
},


  // === PIERNAS ===
 // CUADRÍCEPS
 {
  id: "sentadilla-barra",
  nombre: "Sentadilla (barra)",
  grupo: "pierna",
  series: 3,
  reps: "6-10",
},
{
  id: "sentadilla-frontal",
  nombre: "Sentadilla frontal (barra)",
  grupo: "pierna",
  series: 3,
  reps: "6-10",
},
{
  id: "sentadilla-goblet",
  nombre: "Sentadilla goblet (mancuerna)",
  grupo: "pierna",
  series: 3,
  reps: "10-15",
},
{
  id: "sentadilla-bulgaro",
  nombre: "Zancada búlgara (mancuernas)",
  grupo: "pierna",
  series: 3,
  reps: "8-12",
},
{
  id: "zancada-caminando",
  nombre: "Zancada caminando",
  grupo: "pierna",
  series: 3,
  reps: "10-15",
},
{
  id: "prensa-45",
  nombre: "Prensa 45°",
  grupo: "pierna",
  series: 3,
  reps: "8-12",
},
{
  id: "sentadilla-smith",
  nombre: "Sentadilla en Smith",
  grupo: "pierna",
  series: 3,
  reps: "8-12",
},
{
  id: "prensa-horizontal",
  nombre: "Prensa horizontal",
  grupo: "pierna",
  series: 3,
  reps: "10-15",
},
{
  id: "extension-cuadriceps",
  nombre: "Extensión de cuádriceps",
  grupo: "pierna",
  series: 4,
  reps: "12-15",
},
{
  id: "sissy-squat",
  nombre: "Sissy squat",
  grupo: "pierna",
  series: 3,
  reps: "10-15",
},
{
  id: "step-up",
  nombre: "Step-up con mancuerna",
  grupo: "pierna",
  series: 3,
  reps: "10-12",
},


// ISQUIOTIBIALES
{
  id: "peso-muerto-rumano",
  nombre: "Peso muerto rumano (barra)",
  grupo: "pierna",
  series: 3,
  reps: "6-10",
},
{
  id: "peso-muerto-mancuernas",
  nombre: "Peso muerto rumano (mancuernas)",
  grupo: "pierna",
  series: 3,
  reps: "8-12",
},
{
  id: "curl-femoral-acostado",
  nombre: "Curl femoral acostado",
  grupo: "pierna",
  series: 4,
  reps: "12-15",
},
{
  id: "curl-femoral-sentado",
  nombre: "Curl femoral sentado",
  grupo: "pierna",
  series: 4,
  reps: "12-15",
},
{
  id: "curl-femoral-banda",
  nombre: "Curl femoral en banda",
  grupo: "pierna",
  series: 3,
  reps: "15-20",
},
{
  id: "curl-femoral-maquina-variacion",
  nombre: "Curl femoral en máquina (cualquier variante)",
  grupo: "pierna",
  series: 4,
  reps: "12-15",
},
{
  id: "puente-gluteo-barra",
  nombre: "Hip thrust (barra)",
  grupo: "pierna",
  series: 3,
  reps: "6-10",
},
{
  id: "puente-gluteo-mancuernas",
  nombre: "Hip thrust (mancuernas)",
  grupo: "pierna",
  series: 3,
  reps: "10-15",
},
{
  id: "glute-bridge",
  nombre: "Glute bridge",
  grupo: "pierna",
  series: 3,
  reps: "10-15",
},
{
  id: "buenos-dias-barra",
  nombre: "Buenos días (barra)",
  grupo: "pierna",
  series: 3,
  reps: "8-12",
},
{
  id: "peso-muerto-piernas-rigidas",
  nombre: "Peso muerto piernas rígidas",
  grupo: "pierna",
  series: 3,
  reps: "8-12",
},

// GLÚTEOS
{
  id: "patada-gluteo-polea",
  nombre: "Patada de glúteo en polea",
  grupo: "pierna",
  series: 3,
  reps: "12-15",
},
{
  id: "patada-gluteo-banda",
  nombre: "Patada glúteo banda elástica",
  grupo: "pierna",
  series: 3,
  reps: "15-20",
},
{
  id: "abduccion-maquina",
  nombre: "Abducción de cadera (máquina)",
  grupo: "pierna",
  series: 4,
  reps: "15-25",
},
{
  id: "abduccion-polea",
  nombre: "Abducción en polea",
  grupo: "pierna",
  series: 3,
  reps: "12-20",
},
{
  id: "sentadilla-sumo",
  nombre: "Sentadilla sumo (barra o mancuerna)",
  grupo: "pierna",
  series: 3,
  reps: "10-15",
},
{
  id: "sentadilla-anderson",
  nombre: "Sentadilla Anderson",
  grupo: "pierna",
  series: 3,
  reps: "6-10",
},

// ADUCTORES
{
  id: "aductor-maquina",
  nombre: "Aductores en máquina",
  grupo: "pierna",
  series: 3,
  reps: "12-15",
},
{
  id: "aductor-band",
  nombre: "Trabajo de aductores con banda",
  grupo: "pierna",
  series: 3,
  reps: "15-20",
},

// GEMELOS
{
  id: "gemelos-sentado",
  nombre: "Elevación de gemelos sentado",
  grupo: "pierna",
  series: 4,
  reps: "12-20",
},
{
  id: "gemelos-de-pie",
  nombre: "Elevación de gemelos de pie",
  grupo: "pierna",
  series: 4,
  reps: "12-20",
},
{
  id: "gemelos-prensa",
  nombre: "Elevación de gemelos en prensa",
  grupo: "pierna",
  series: 4,
  reps: "12-20",
},
{
  id: "donkey-calf-raise",
  nombre: "Donkey calf raise",
  grupo: "pierna",
  series: 4,
  reps: "12-20",
},


];

export const buscarEjercicios = (termino: string): Ejercicio[] => {
  if (!termino || termino.length < 2) return [];
  const lowerTermino = termino.toLowerCase();
  return ejerciciosDB.filter(
    (ej) =>
      ej.nombre.toLowerCase().includes(lowerTermino) ||
      ej.grupo.toLowerCase().includes(lowerTermino)
  );
};
