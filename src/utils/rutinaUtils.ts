import { dias, rutina } from "../data/rutina";
import { DiaRutina, Series } from "../types";

export const seriesToRange = (s: Series): [number, number] => {
  if (typeof s === "number") return [s, s];
  const str = String(s || "");
  const matches = str.match(/\d+/g);
  if (!matches || matches.length === 0) return [0, 0];
  const a = parseInt(matches[0], 10) || 0;
  const b = matches.length > 1 ? parseInt(matches[1], 10) || a : a;
  return [a, b];
};

export const withIds = (d: DiaRutina, prefix: string): DiaRutina => ({
  ...d,
  ejercicios: d.ejercicios.map((e, i) => ({ ...e, id: `${prefix}-E${i + 1}` })),
});

export const normalizeRutina = (maybeRutina: unknown): typeof rutina => {
  const out: any = {};
  dias.forEach((d) => {
    const src = maybeRutina && (maybeRutina as any)[d] ? (maybeRutina as any)[d] : rutina[d];
    const ejercicios = Array.isArray(src.ejercicios) ? src.ejercicios : [];
    const seen = new Set<string>();
    out[d] = {
      ...src,
      ejercicios: ejercicios.map((e: any, i: number) => {
        if (e && typeof e.id === "string" && e.id.trim().length > 0 && !seen.has(e.id)) {
          seen.add(e.id);
          return { ...e };
        }
        const gen = `${d}-E${i + 1}`;
        seen.add(gen);
        return { ...e, id: gen };
      }),
    };
  });
  return out as typeof rutina;
};

export const minSeriesFrom = (series: Series): number => {
  if (typeof series === "number") return series;
  const [min] = seriesToRange(series);
  return min;
};
