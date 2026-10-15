import { useMemo } from "react";

const CORES = [
  "oklch(0.7 0.17 35)",
  "oklch(0.6 0.14 155)",
  "oklch(0.62 0.15 250)",
  "oklch(0.72 0.16 40)",
  "oklch(0.58 0.22 27)",
];

/** Chuva de confetes em CSS puro, sem biblioteca. */
export function Confetes({ total = 48 }: { total?: number }) {
  const pecas = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        dur: 2.2 + Math.random() * 1.8,
        cor: CORES[i % CORES.length]!,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
      })),
    [total],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pecas.map((p, i) => (
        <span key={i} className="confete" style={{
          left: `${p.left}%`,
          background: p.cor,
          width: p.w,
          height: p.h,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.dur}s`,
        }} />
      ))}
    </div>
  );
}
