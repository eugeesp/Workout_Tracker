import { dias, rutina } from "../data/rutina";
import { DiaRutina } from "../types";

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
