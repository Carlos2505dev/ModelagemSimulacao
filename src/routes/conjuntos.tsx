import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/conjuntos")({
  head: () => ({
    meta: [
      { title: "Laboratório de Conjuntos — LógiCo" },
      { name: "description", content: "Operações entre conjuntos com Diagrama de Venn interativo: união, interseção, diferença e complemento." },
      { property: "og:title", content: "Laboratório de Conjuntos — LógiCo" },
      { property: "og:description", content: "Teste pertinência, inclusão e operações entre conjuntos de forma visual." },
    ],
  }),
  component: Conjuntos,
});

const parseSet = (s: string) => [...new Set(s.split(/[,;\s]+/).map((x) => x.trim()).filter(Boolean))];
const fmt = (xs: string[]) => (xs.length ? `{ ${xs.join(", ")} }` : "∅");

type Op = "uniao" | "inter" | "difAB" | "difBA" | "compA" | "simetrica";
const OPS: { id: Op; sym: string; name: string; desc: string }[] = [
  { id: "uniao", sym: "A ∪ B", name: "União", desc: "Elementos que estão em A OU em B." },
  { id: "inter", sym: "A ∩ B", name: "Interseção", desc: "Elementos que estão em A E em B." },
  { id: "difAB", sym: "A − B", name: "Diferença", desc: "Elementos de A que não estão em B." },
  { id: "difBA", sym: "B − A", name: "Diferença", desc: "Elementos de B que não estão em A." },
  { id: "simetrica", sym: "A Δ B", name: "Dif. simétrica", desc: "Em A ou em B, mas não em ambos." },
  { id: "compA", sym: "Aᶜ", name: "Complemento", desc: "Elementos do universo U que não estão em A." },
];

const PRESETS = [
  { name: "Números", U: "1 2 3 4 5 6 7 8 9 10", A: "2 4 6 8 10", B: "3 6 9" },
  { name: "Linguagens", U: "Python Java C JS Go Rust Ruby", A: "Python JS Ruby", B: "Java C Go Rust JS" },
  { name: "Vogais", U: "a b c d e f g h i o u", A: "a e i o u", B: "a b c d e" },
];

function Conjuntos() {
  const [U, setU] = useState(PRESETS[0].U);
  const [A, setA] = useState(PRESETS[0].A);
  const [B, setB] = useState(PRESETS[0].B);
  const [op, setOp] = useState<Op>("inter");
  const [el, setEl] = useState("6");

  const s = useMemo(() => {
    const u = parseSet(U), a = parseSet(A), b = parseSet(B);
    const inB = new Set(b), inA = new Set(a);
    const uni = [...new Set([...a, ...b])];
    const res: Record<Op, string[]> = {
      uniao: uni,
      inter: a.filter((x) => inB.has(x)),
      difAB: a.filter((x) => !inB.has(x)),
      difBA: b.filter((x) => !inA.has(x)),
      simetrica: uni.filter((x) => inA.has(x) !== inB.has(x)),
      compA: u.filter((x) => !inA.has(x)),
    };
    const fora = uni.filter((x) => !u.includes(x));
    return { u, a, b, inA, inB, res, fora };
  }, [U, A, B]);

  const result = s.res[op];
  const cur = OPS.find((o) => o.id === op)!;
  const sub = (x: string[], y: Set<string>) => x.every((e) => y.has(e));
  const onlyA = s.res.difAB, onlyB = s.res.difBA, both = s.res.inter;
  const outside = s.u.filter((x) => !s.inA.has(x) && !s.inB.has(x));
  const hl = {
    a: ["uniao", "difAB", "simetrica"].includes(op),
    b: ["uniao", "difBA", "simetrica"].includes(op),
    ab: ["uniao", "inter"].includes(op),
    out: op === "compA",
  };
  if (op === "compA") { hl.b = true; }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold md:text-5xl">Laboratório de Conjuntos</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Defina U, A e B (separe por espaço ou vírgula), escolha uma operação e veja o diagrama acender.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.name} className="btn-ink bg-card text-sm" onClick={() => { setU(p.U); setA(p.A); setB(p.B); }}>
            Exemplo: {p.name}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="card-ink space-y-4 p-6">
          {([["U (universo)", U, setU], ["A", A, setA], ["B", B, setB]] as const).map(([l, v, f]) => (
            <label key={l} className="block">
              <span className="text-sm font-semibold">{l}</span>
              <input className="field-ink mt-1" value={v} onChange={(e) => f(e.target.value)} />
            </label>
          ))}
          {s.fora.length > 0 && (
            <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
              Atenção: {fmt(s.fora)} não pertence ao universo U.
            </p>
          )}
          <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-3">
            {OPS.map((o) => (
              <button key={o.id} onClick={() => setOp(o.id)}
                className={`btn-ink font-mono text-sm ${op === o.id ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                {o.sym}
              </button>
            ))}
          </div>
        </div>

        <div className="card-ink p-6">
          <svg viewBox="0 0 400 260" className="w-full" role="img" aria-label={`Diagrama de Venn para ${cur.sym}`}>
            <rect x="4" y="4" width="392" height="252" rx="12" strokeWidth="2"
              className={`stroke-foreground transition-colors ${hl.out ? "fill-accent/50" : "fill-transparent"}`} />
            <defs>
              <clipPath id="ca"><circle cx="155" cy="130" r="95" /></clipPath>
            </defs>
            <circle cx="155" cy="130" r="95" className={`transition-colors ${hl.a ? "fill-set-a/80" : op === "compA" ? "fill-background" : "fill-set-a/15"}`} />
            <circle cx="245" cy="130" r="95" className={`transition-colors ${hl.b ? (op === "compA" ? "fill-accent/50" : "fill-set-b/80") : "fill-set-b/15"}`} />
            <circle cx="245" cy="130" r="95" clipPath="url(#ca)"
              className={`transition-colors ${hl.ab ? "fill-primary/80" : op === "compA" ? "fill-background" : hl.a || hl.b ? "fill-background" : "fill-muted"}`} />
            <circle cx="155" cy="130" r="95" fill="none" strokeWidth="2.5" className="stroke-foreground" />
            <circle cx="245" cy="130" r="95" fill="none" strokeWidth="2.5" className="stroke-foreground" />
            <text x="16" y="28" className="fill-current font-mono text-sm font-semibold">U</text>
            <text x="90" y="52" className="fill-current font-display text-xl font-bold">A</text>
            <text x="300" y="52" className="fill-current font-display text-xl font-bold">B</text>
            <Labels items={onlyA} x={110} />
            <Labels items={both} x={200} />
            <Labels items={onlyB} x={290} />
            <text x="200" y="246" textAnchor="middle" className="fill-current font-mono text-[11px]">{outside.slice(0, 8).join("  ")}</text>
          </svg>
          <div className="mt-4 rounded-lg border-2 border-foreground bg-secondary p-4">
            <p className="text-sm text-muted-foreground">{cur.name}: {cur.desc}</p>
            <p className="mt-1 font-mono text-lg font-semibold">{cur.sym} = {fmt(result)}</p>
            <p className="font-mono text-sm text-muted-foreground">n({cur.sym}) = {result.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-ink p-6">
          <h2 className="text-2xl font-bold">Pertinência (∈ / ∉)</h2>
          <p className="text-sm text-muted-foreground">Relação entre <em>elemento</em> e conjunto.</p>
          <input className="field-ink mt-3" value={el} onChange={(e) => setEl(e.target.value.trim())} placeholder="elemento" />
          <ul className="mt-3 space-y-1 font-mono">
            <li>{el || "x"} {s.inA.has(el) ? "∈" : "∉"} A</li>
            <li>{el || "x"} {s.inB.has(el) ? "∈" : "∉"} B</li>
            <li>{el || "x"} {s.u.includes(el) ? "∈" : "∉"} U</li>
          </ul>
        </div>
        <div className="card-ink p-6">
          <h2 className="text-2xl font-bold">Inclusão e tipos (⊂ / ⊄)</h2>
          <p className="text-sm text-muted-foreground">Relação entre <em>conjunto</em> e conjunto.</p>
          <ul className="mt-3 space-y-1 font-mono">
            <li>A {sub(s.a, s.inB) ? "⊂" : "⊄"} B · B {sub(s.b, s.inA) ? "⊂" : "⊄"} A</li>
            <li>A {sub(s.a, new Set(s.u)) ? "⊂" : "⊄"} U</li>
            <li>A {s.a.length === s.b.length && sub(s.a, s.inB) ? "=" : "≠"} B</li>
            <li>A e B são {both.length ? "não disjuntos" : "disjuntos"}</li>
            <li>A é {s.a.length === 0 ? "vazio" : s.a.length === 1 ? "unitário" : "finito"} · n(A) = {s.a.length}</li>
            <li>|𝒫(A)| = 2^{s.a.length} = {2 ** s.a.length}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Labels({ items, x }: { items: string[]; x: number }) {
  const shown = items.slice(0, 6);
  return (
    <>
      {shown.map((t, i) => (
        <text key={t} x={x} y={95 + i * 18} textAnchor="middle" className="fill-current font-mono text-xs font-semibold">{t}</text>
      ))}
      {items.length > 6 && <text x={x} y={95 + 6 * 18} textAnchor="middle" className="fill-current font-mono text-xs">+{items.length - 6}</text>}
    </>
  );
}
