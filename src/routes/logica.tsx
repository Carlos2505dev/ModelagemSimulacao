import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useMemo, useState } from "react";
import { classify, equivalent, evaluate, parse, rows, show, subexprs, vars, type Node } from "@/lib/logic";

export const Route = createFileRoute("/logica")({
  head: () => ({
    meta: [
      { title: "Máquina da Verdade — LógiCo" },
      { name: "description", content: "Gerador de tabelas-verdade, conectivos lógicos, equivalências e quantificadores." },
      { property: "og:title", content: "Máquina da Verdade — LógiCo" },
      { property: "og:description", content: "Digite uma proposição e veja sua tabela-verdade completa." },
    ],
  }),
  component: Logica,
});

const CONECTIVOS = [
  { s: "¬", n: "Negação", r: "não p", ex: "Inverte o valor." },
  { s: "∧", n: "Conjunção", r: "p e q", ex: "V só se ambas V." },
  { s: "∨", n: "Disjunção", r: "p ou q", ex: "F só se ambas F." },
  { s: "→", n: "Condicional", r: "se p então q", ex: "F só em V → F." },
  { s: "↔", n: "Bicondicional", r: "p se e só se q", ex: "V quando iguais." },
];
const INSERT = ["¬", "∧", "∨", "→", "↔", "(", ")", "p", "q", "r"];
const EXEMPLOS = ["p → q", "¬(p ∧ q) ↔ (¬p ∨ ¬q)", "p ∨ ¬p", "p ∧ ¬p", "(p → q) ∧ (q → r) → (p → r)"];

function tryParse(s: string): { n?: Node; err?: string } {
  try { return { n: parse(s) }; } catch (e) { return { err: (e as Error).message }; }
}

function Logica() {
  const [src, setSrc] = useState("(p → q) ∧ p");
  const dsrc = useDeferredValue(src);
  const { n, err } = useMemo(() => tryParse(dsrc), [dsrc]);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-extrabold md:text-5xl">Máquina da Verdade</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Uma <strong>proposição</strong> é uma sentença declarativa que pode ser V ou F. Combine proposições com conectivos e
          a máquina monta a tabela-verdade para você.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-5">
        {CONECTIVOS.map((c) => (
          <div key={c.s} className="card-ink p-4">
            <div className="font-mono text-3xl font-semibold text-accent">{c.s}</div>
            <div className="mt-1 font-semibold">{c.n}</div>
            <div className="text-sm text-muted-foreground">{c.r}</div>
            <div className="mt-1 text-xs">{c.ex}</div>
          </div>
        ))}
      </section>

      <section className="card-ink space-y-4 p-6">
        <label className="block">
          <span className="font-semibold">Proposição</span>
          <input className="field-ink mt-1 text-lg" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} />
        </label>
        <div className="flex flex-wrap gap-2">
          {INSERT.map((s) => (
            <button key={s} className="btn-ink min-w-10 bg-card px-3 py-1 font-mono" onClick={() => setSrc((v) => v + (s.length === 1 && /[pqr()]/.test(s) ? s : ` ${s} `))}>{s}</button>
          ))}
          <button className="btn-ink bg-secondary px-3 py-1 text-sm" onClick={() => setSrc("")}>Limpar</button>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-muted-foreground">Exemplos:</span>
          {EXEMPLOS.map((e) => (
            <button key={e} className="rounded border border-foreground/30 px-2 font-mono hover:bg-secondary" onClick={() => setSrc(e)}>{e}</button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Também aceita teclado: ~ ou ! (não), ^ ou &amp; (e), v ou | (ou), -&gt; e &lt;-&gt;.</p>
        {err ? <p className="rounded-md bg-destructive/10 p-3 text-destructive">{err}</p> : n && <TruthTable n={n} />}
      </section>

      <Equivalencia />
      <Quantificadores />
    </div>
  );
}

function TruthTable({ n }: { n: Node }) {
  const vs = vars(n);
  if (vs.length > 5) return <p className="text-destructive">Use no máximo 5 variáveis.</p>;
  const cols = subexprs(n);
  const rs = rows(vs);
  const cls = classify(n);
  const tone = cls === "Tautologia" ? "bg-success" : cls === "Contradição" ? "bg-destructive" : "bg-set-a";
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-md border-2 border-foreground px-3 py-1 font-semibold text-primary-foreground ${tone}`}>{cls}</span>
        <span className="text-sm text-muted-foreground">{rs.length} linhas = 2^{vs.length}</span>
      </div>
      <div className="overflow-x-auto rounded-lg border-2 border-foreground">
        <table className="w-full text-center font-mono">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              {vs.map((v) => <th key={v} className="px-3 py-2">{v}</th>)}
              {cols.map((c, i) => <th key={i} className={`whitespace-nowrap px-3 py-2 ${i === cols.length - 1 ? "bg-accent" : ""}`}>{show(c)}</th>)}
            </tr>
          </thead>
          <tbody>
            {rs.map((env, i) => (
              <tr key={i} className="border-t border-border even:bg-secondary/50">
                {vs.map((v) => <td key={v} className="px-3 py-1.5">{env[v] ? "V" : "F"}</td>)}
                {cols.map((c, j) => {
                  const val = evaluate(c, env);
                  return <td key={j} className={`px-3 py-1.5 font-semibold ${val ? "text-success" : "text-destructive"} ${j === cols.length - 1 ? "bg-accent/10" : ""}`}>{val ? "V" : "F"}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Equivalencia() {
  const [a, setA] = useState("p → q");
  const [b, setB] = useState("¬q → ¬p");
  const pa = tryParse(a), pb = tryParse(b);
  const ok = pa.n && pb.n ? equivalent(pa.n, pb.n) : null;
  return (
    <section className="card-ink p-6">
      <h2 className="text-3xl font-bold">Equivalências lógicas (⇔)</h2>
      <p className="text-muted-foreground">Duas proposições são equivalentes quando têm a mesma tabela-verdade.</p>
      <div className="mt-4 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <input className="field-ink" value={a} onChange={(e) => setA(e.target.value)} />
        <span className="text-center font-mono text-2xl">⇔ ?</span>
        <input className="field-ink" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      <p className={`mt-4 rounded-md border-2 border-foreground p-3 font-semibold ${ok === null ? "bg-secondary" : ok ? "bg-success text-primary-foreground" : "bg-destructive text-primary-foreground"}`}>
        {ok === null ? pa.err || pb.err : ok ? "São logicamente equivalentes ✓" : "Não são equivalentes ✗"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {([["p → q", "¬q → ¬p"], ["¬(p ∧ q)", "¬p ∨ ¬q"], ["¬(p ∨ q)", "¬p ∧ ¬q"], ["p → q", "¬p ∨ q"], ["p → q", "q → p"]] as [string, string][]).map(([x, y]) => (
          <button key={x + y} className="rounded border border-foreground/30 px-2 font-mono hover:bg-secondary" onClick={() => { setA(x); setB(y); }}>{x} ⇔ {y}</button>
        ))}
      </div>
    </section>
  );
}

const PREDICADOS: { id: string; txt: string; f: (x: number) => boolean }[] = [
  { id: "par", txt: "x é par", f: (x) => x % 2 === 0 },
  { id: "pos", txt: "x > 0", f: (x) => x > 0 },
  { id: "primo", txt: "x é primo", f: (x) => x > 1 && Array.from({ length: x - 2 }, (_, i) => i + 2).every((d) => x % d) },
  { id: "q", txt: "x² > 50", f: (x) => x * x > 50 },
  { id: "m3", txt: "x é múltiplo de 3", f: (x) => x % 3 === 0 },
];

function Quantificadores() {
  const [dom, setDom] = useState("1 2 3 4 5 6 7 8 9 10");
  const [pid, setPid] = useState("par");
  const p = PREDICADOS.find((x) => x.id === pid)!;
  const xs = dom.split(/[,\s]+/).map(Number).filter((n) => Number.isFinite(n) && dom.trim() !== "");
  const sat = xs.filter(p.f);
  return (
    <section className="card-ink p-6">
      <h2 className="text-3xl font-bold">Sentenças abertas e quantificadores</h2>
      <p className="text-muted-foreground">
        “{p.txt}” não é proposição — depende de x. Ao aplicar <strong>∀</strong> (para todo) ou <strong>∃</strong> (existe), ela vira proposição.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block"><span className="text-sm font-semibold">Domínio D</span>
          <input className="field-ink mt-1" value={dom} onChange={(e) => setDom(e.target.value)} /></label>
        <div>
          <span className="text-sm font-semibold">P(x)</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {PREDICADOS.map((q) => (
              <button key={q.id} onClick={() => setPid(q.id)} className={`btn-ink px-3 py-1 text-sm ${q.id === pid ? "bg-primary text-primary-foreground" : "bg-card"}`}>{q.txt}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {xs.map((x, i) => (
          <span key={i} className={`rounded-md border-2 border-foreground px-2.5 py-1 font-mono ${p.f(x) ? "bg-success text-primary-foreground" : "bg-secondary"}`}>{x}</span>
        ))}
      </div>
      <div className="mt-4 grid gap-3 font-mono md:grid-cols-2">
        <div className="rounded-md border-2 border-foreground p-3">∀x ∈ D, {p.txt} → <b>{xs.length > 0 && sat.length === xs.length ? "V" : "F"}</b></div>
        <div className="rounded-md border-2 border-foreground p-3">∃x ∈ D, {p.txt} → <b>{sat.length > 0 ? "V" : "F"}</b></div>
      </div>
      <p className="mt-2 font-mono text-sm text-muted-foreground">Conjunto-verdade V = {sat.length ? `{ ${sat.join(", ")} }` : "∅"}</p>
    </section>
  );
}
