import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { classify, equivalent, evaluate, parse, rows, show, subexprs, vars, type Node } from "@/lib/logic";
import { sup } from "@/lib/utils";
import { useFavoritas } from "@/lib/favoritas";

export const Route = createFileRoute("/logica")({
  validateSearch: (search: Record<string, unknown>): { f?: string; fa?: string; fb?: string; s?: string } => {
    const out: { f?: string; fa?: string; fb?: string; s?: string } = {};
    for (const k of ["f", "fa", "fb", "s"] as const) {
      const v = search[k];
      if (typeof v === "string") out[k] = v;
    }
    return out;
  },
  head: () => ({
    meta: [
      { title: "Máquina da Verdade · LógiCo" },
      { name: "description", content: "Gerador de tabelas-verdade, conectivos lógicos, equivalências e quantificadores." },
      { property: "og:title", content: "Máquina da Verdade · LógiCo" },
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

const PRINCIPIOS = [
  { t: "Identidade", f: "p = p", d: "Tudo é idêntico a si mesmo." },
  { t: "Não-contradição", f: "¬(p ∧ ¬p)", d: "Uma proposição não pode ser V e F ao mesmo tempo." },
  { t: "Terceiro excluído", f: "p ∨ ¬p", d: "Toda proposição é V ou F, nunca um terceiro valor." },
];

function tryParse(s: string): { n?: Node; err?: string } {
  try { return { n: parse(s) }; } catch (e) { return { err: (e as Error).message }; }
}

function Caderno({ onUsar }: { onUsar: (f: string) => void }) {
  const favs = useFavoritas();
  if (!favs.lista.length) return null;
  return (
    <section className="card-ink p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold">Caderno de fórmulas</h2>
        <span className="font-mono text-sm text-muted-foreground">{favs.lista.length} guardadas</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {favs.lista.map((f) => (
          <span key={f} className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-secondary py-1 pl-3 pr-1 font-mono text-sm">
            <button className="hover:underline" title="Carregar na máquina"
              onClick={() => {
                onUsar(f);
                document.getElementById("maquina")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}>
              {f}
            </button>
            <button aria-label="Remover do caderno" title="Remover" onClick={() => favs.remover(f)}
              className="rounded px-1.5 hover:bg-destructive hover:text-primary-foreground">
              ✕
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}

function Logica() {
  const { f, s } = Route.useSearch();
  const [src, setSrc] = useState(f ?? "(p → q) ∧ p");
  useEffect(() => {
    if (f !== undefined) setSrc(f);
  }, [f]);
  useEffect(() => {
    if (!s) return;
    const t = setTimeout(() => document.getElementById(s)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    return () => clearTimeout(t);
  }, [s]);
  const dsrc = useDeferredValue(src);
  const { n, err } = useMemo(() => tryParse(dsrc), [dsrc]);

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-sm font-semibold text-accent">Escreva e Descubra o Valor</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Máquina da Verdade</h1>
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

      <section id="principios" className="card-ink scroll-mt-24 space-y-3 p-6">
        <h2 className="text-2xl font-bold">Princípios da lógica + valor lógico VL(p)</h2>
        <p className="text-sm text-muted-foreground">
          Proposição é sentença declarativa com um único valor: <span className="font-mono">VL(p) = V</span> ou{" "}
          <span className="font-mono">VL(p) = F</span>. Ex.: p: “Carlos é professor” (V), q: “1 &gt; 5” (F).
          Frases interrogativas (“Onde você mora?”), imperativas (“Compareça!”) e exclamativas não são proposições.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {PRINCIPIOS.map((p) => (
            <div key={p.t} className="rounded-lg border-2 border-foreground bg-secondary p-4">
              <div className="font-bold">{p.t}</div>
              <div className="mt-1 font-mono text-sm">{p.f}</div>
              <div className="mt-1 text-sm text-muted-foreground">{p.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="maquina" className="card-ink scroll-mt-24 space-y-4 p-6">
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
        {err ? <p className="rounded-md bg-destructive/10 p-3 text-destructive">{err}</p> : n && <TruthTable n={n} formula={dsrc} />}
      </section>

      <Caderno onUsar={setSrc} />
      <Equivalencia />
      <Tradutor />
      <Consistencia />
      <Demonstracoes />
      <Argumentos />
      <Lacunas />
      <Quantificadores />
    </div>
  );
}

function TruthTable({ n, formula }: { n: Node; formula?: string }) {
  const favs = useFavoritas();
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
        <span className="text-sm text-muted-foreground">{rs.length} linhas = 2<sup>{vs.length}</sup></span>
        {formula && (
          <button onClick={() => favs.alternar(formula)}
            aria-label={favs.tem(formula) ? "Remover do caderno" : "Guardar no caderno"}
            title={favs.tem(formula) ? "Remover do caderno" : "Guardar no caderno"}
            className={`btn-ink px-3 py-1 font-mono text-sm ${favs.tem(formula) ? "bg-accent text-accent-foreground" : "bg-card"}`}>
            <Star size={14} fill={favs.tem(formula) ? "currentColor" : "none"} />
          </button>
        )}
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
  const { fa, fb } = Route.useSearch();
  const [a, setA] = useState(fa ?? "p → q");
  const [b, setB] = useState(fb ?? "¬q → ¬p");
  useEffect(() => {
    if (fa !== undefined) setA(fa);
  }, [fa]);
  useEffect(() => {
    if (fb !== undefined) setB(fb);
  }, [fb]);
  const pa = tryParse(a), pb = tryParse(b);
  const ok = pa.n && pb.n ? equivalent(pa.n, pb.n) : null;
  const vs = pa.n && pb.n ? [...new Set([...vars(pa.n), ...vars(pb.n)])].sort() : [];
  const rs = vs.length > 0 && vs.length <= 5 ? rows(vs) : [];
  return (
    <section id="equivalencias" className="card-ink scroll-mt-24 p-6">
      <h2 className="text-3xl font-bold">Equivalências lógicas (⇔)</h2>
      <p className="text-muted-foreground">P ⇔ Q quando P ↔ Q é tautologia: mesma coluna V/F em todas as linhas. Ex.: p → q ≡ ¬p ∨ q.</p>
      <div className="mt-4 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <input className="field-ink" value={a} onChange={(e) => setA(e.target.value)} />
        <span className="text-center font-mono text-2xl">⇔ ?</span>
        <input className="field-ink" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      <p className={`mt-4 rounded-md border-2 border-foreground p-3 font-semibold ${ok === null ? "bg-secondary" : ok ? "bg-success text-primary-foreground" : "bg-destructive text-primary-foreground"}`}>
        {ok === null ? pa.err || pb.err : ok ? "São logicamente equivalentes ✓" : "Não são equivalentes ✗, veja a linha divergente abaixo"}
      </p>
      {pa.n && pb.n && rs.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-lg border-2 border-foreground">
          <table className="w-full text-center font-mono text-sm">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                {vs.map((v) => <th key={v} className="px-3 py-2">{v}</th>)}
                <th className="px-3 py-2">{show(pa.n)}</th>
                <th className="px-3 py-2">{show(pb.n)}</th>
                <th className="px-3 py-2">=</th>
              </tr>
            </thead>
            <tbody>
              {rs.map((env, i) => {
                const va = evaluate(pa.n!, env);
                const vb = evaluate(pb.n!, env);
                const diff = va !== vb;
                return (
                  <tr key={i} className={`border-t border-border ${diff ? "bg-destructive/15 font-bold" : "even:bg-secondary/50"}`}>
                    {vs.map((v) => <td key={v} className="px-3 py-1.5">{env[v] ? "V" : "F"}</td>)}
                    <td className={va ? "text-success" : "text-destructive"}>{va ? "V" : "F"}</td>
                    <td className={vb ? "text-success" : "text-destructive"}>{vb ? "V" : "F"}</td>
                    <td>{diff ? "✗" : "✓"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {([["p → q", "¬q → ¬p"], ["¬(p ∧ q)", "¬p ∨ ¬q"], ["¬(p ∨ q)", "¬p ∧ ¬q"], ["p → q", "¬p ∨ q"], ["p → q", "q → p"]] as [string, string][]).map(([x, y]) => (
          <button key={x + y} className="rounded border border-foreground/30 px-2 font-mono hover:bg-secondary" onClick={() => { setA(x); setB(y); }}>{x} ⇔ {y}</button>
        ))}
      </div>
    </section>
  );
}

const TRADUCOES = [
  {
    titulo: "Montanha-russa",
    frase: "Você não pode andar se tem menos de 1,50m, a menos que tenha mais de 16 anos.",
    defs: "p: pode andar · q: tem < 1,50m · r: tem > 16 anos",
    formula: "(q ∧ ¬r) → ¬p",
  },
  {
    titulo: "Resposta automática",
    frase: "A resposta automática não pode ser enviada quando o sistema de arquivos está cheio.",
    defs: "p: resposta pode ser enviada · q: sistema cheio",
    formula: "q → ¬p",
  },
];

function Tradutor() {
  const [modo, setModo] = useState<"livre" | "guiado">("livre");
  return (
    <section id="tradutor" className="card-ink scroll-mt-24 p-6">
      <h2 className="text-3xl font-bold">Traduzindo linguagem natural</h2>
      <p className="text-muted-foreground">Frases do dia a dia são ambíguas. Traduzir para proposições remove a ambiguidade e permite analisar o valor-verdade.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["livre", "guiado"] as const).map((m) => (
          <button key={m} onClick={() => setModo(m)} className={`btn-ink px-3 py-1 text-sm ${m === modo ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {m === "livre" ? "Escrever em português" : "Exemplos guiados"}
          </button>
        ))}
      </div>
      <div className="mt-4">{modo === "livre" ? <NLivre /> : <Guiado />}</div>
    </section>
  );
}

function Guiado() {
  const [idx, setIdx] = useState(0);
  const t = TRADUCOES[idx]!;
  const parsed = tryParse(t.formula);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TRADUCOES.map((x, i) => (
          <button key={x.titulo} onClick={() => setIdx(i)} className={`btn-ink px-3 py-1 text-sm ${i === idx ? "bg-primary text-primary-foreground" : "bg-card"}`}>{x.titulo}</button>
        ))}
      </div>
      <div className="rounded-lg border-2 border-foreground bg-secondary p-4">
        <p className="italic">“{t.frase}”</p>
        <p className="mt-2 font-mono text-sm">{t.defs}</p>
        <p className="mt-1 font-mono text-lg font-bold">{t.formula}</p>
      </div>
      {parsed.err ? <p className="text-destructive">{parsed.err}</p> : parsed.n && <TruthTable n={parsed.n} formula={t.formula} />}
    </div>
  );
}

const NL_TEMPLATES = ["Se … então …", "… e …", "… ou …", "Não …", "… se e somente se …"];
const NL_VARS = ["p", "q", "r", "s", "t"];
const NL_IMPERATIVOS = /^(feche|fecha|abra|abre|faça|faz|compareça|venha|vem|vá|vai|digite|clique|pare|continue|responda|marque|ligue|desligue|traga|leve)\b/i;

type NLRes =
  | { kind: "empty" }
  | { kind: "nprop"; title: string; why: string; fix: string }
  | { kind: "amb"; title: string; why: string; fix: string }
  | { kind: "ok"; atoms: string[]; formula: string; note?: string };

function nlIncompleta(): NLRes {
  return { kind: "amb", title: "Falta um lado do conectivo", why: "Todo conectivo precisa de frase antes e depois dele.", fix: "Complete os dois lados. Ex.: “Chove e faz frio.”" };
}

function nlAmb(): NLRes {
  return { kind: "amb", title: "Mais de um conectivo diferente", why: "Com “e” e “ou” misturados dá para ler de dois jeitos (ambiguidade).", fix: "Use os modelos com uma ligação por vez, ou teste cada parte separada na Máquina da Verdade." };
}

function nlTemOutro(s: string): boolean {
  const l = ` ${s.toLowerCase()} `;
  return (
    l.includes(" se e somente se ") ||
    l.includes(" ou ") ||
    l.includes(" e ") ||
    l.includes(" mas ") ||
    /^se\s+.+\s+então\s+.+$/i.test(s)
  );
}

function nlOk(parts: string[], op: string | null, note?: string): NLRes {
  if (parts.length > NL_VARS.length) {
    return { kind: "amb", title: "Frase longa demais", why: "O analisador cobre até 5 proposições simples por vez.", fix: "Quebre em frases menores e analise uma de cada vez." };
  }
  let expr = NL_VARS[0]!;
  for (let i = 1; i < parts.length; i++) expr = `(${expr} ${op} ${NL_VARS[i]})`;
  if (op === null) expr = NL_VARS[0]!;
  return { kind: "ok", atoms: parts, formula: expr, ...(note === undefined ? {} : { note }) };
}

/** Tenta ler uma frase em português e mapear para p, q, r… */
function analisarNL(input: string): NLRes {
  const t = input.trim().replace(/\s+/g, " ");
  if (!t) return { kind: "empty" };
  if (t.includes("?")) {
    return { kind: "nprop", title: "Pergunta não é proposição", why: "Termina com “?”: perguntas não podem ser V nem F.", fix: "Reescreva como afirmação. Ex.: “Você mora em São Paulo.”" };
  }
  if (NL_IMPERATIVOS.test(t)) {
    return { kind: "nprop", title: "Ordem não é proposição", why: "Frases imperativas mandam fazer algo, então não dá para dizer se são V ou F.", fix: "Reescreva como afirmação. Ex.: “A porta está fechada.”" };
  }
  if (/!$/.test(t)) {
    return { kind: "nprop", title: "Exclamação não é proposição", why: "Frases exclamativas expressam emoção, não um fato V ou F.", fix: "Reescreva como afirmação. Ex.: “A foto é bonita.”" };
  }

  let neg = false;
  let body = t;
  const mNeg = /^(não|nao|é falso que)\s+(.+)$/i.exec(body);
  if (mNeg) { neg = true; body = mNeg[2]!.trim(); }
  const clean = (s: string) => s.trim().replace(/[.]+$/, "").trim();
  if (!body) {
    return { kind: "amb", title: "Negação sem conteúdo", why: "“Não …” precisa de uma frase depois.", fix: "Complete a frase. Ex.: “Não chove.”" };
  }

  const finish = (parts: string[], op: string | null, note?: string): NLRes => {
    const ps = parts.map(clean);
    if (ps.some((x) => !x)) return nlIncompleta();
    if (ps.some(nlTemOutro)) return nlAmb();
    const r = nlOk(ps, op, note);
    if (r.kind === "ok" && neg) {
      return { ...r, formula: op === null ? `¬${r.formula}` : `¬(${r.formula})` };
    }
    return r;
  };

  const low = ` ${body.toLowerCase()} `;
  if (low.includes(" se e somente se ")) {
    return finish(body.split(/ se e somente se /i), "↔");
  }
  const mImp = /^se\s+(.+?)\s+então\s+(.+)$/i.exec(body);
  if (mImp) {
    return finish([mImp[1]!, mImp[2]!], "→");
  }
  const temOu = low.includes(" ou ");
  const temE = low.includes(" e ") || low.includes(" mas ");
  if (temOu && temE) return nlAmb();
  if (temOu) {
    return finish(body.split(/ ou /i), "∨");
  }
  if (temE) {
    const soMas = !low.includes(" e ");
    return finish(body.split(/\s+(?:e|mas)\s+/i), "∧", soMas ? "“mas” funciona como “e” (∧)." : undefined);
  }
  return finish([body], null);
}

function NLivre() {
  const [txt, setTxt] = useState("Se chove então levo o guarda-chuva");
  const r = useMemo(() => analisarNL(txt), [txt]);
  const parsed = r.kind === "ok" ? tryParse(r.formula) : null;
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="font-semibold">Escreva em português</span>
        <textarea className="field-ink mt-1 min-h-20 text-lg" rows={2} value={txt}
          onChange={(e) => setTxt(e.target.value)} placeholder="Ex.: Se chove então levo o guarda-chuva" />
      </label>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Modelos:</span>
        {NL_TEMPLATES.map((m) => (
          <button key={m} className="rounded border border-foreground/30 px-2 py-0.5 hover:bg-secondary" onClick={() => setTxt(m.replaceAll("…", "").trim())}>{m}</button>
        ))}
      </div>
      {r.kind === "empty" && (
        <p className="rounded-md border-2 border-dashed border-foreground/40 p-3 text-muted-foreground">
          Nada para analisar ainda: escreva uma frase acima ou escolha um modelo.
        </p>
      )}
      {r.kind === "nprop" && (
        <div className="rounded-md border-2 border-foreground bg-destructive/10 p-4">
          <p className="font-bold text-destructive">Não é proposição: {r.title}</p>
          <p className="mt-1 text-sm">{r.why}</p>
          <p className="mt-1 text-sm"><strong>Como arrumar:</strong> {r.fix}</p>
        </div>
      )}
      {r.kind === "amb" && (
        <div className="rounded-md border-2 border-foreground bg-accent/10 p-4">
          <p className="font-bold">Não deu para traduzir: {r.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{r.why}</p>
          <p className="mt-1 text-sm"><strong>Como arrumar:</strong> {r.fix}</p>
        </div>
      )}
      {r.kind === "ok" && (
        <div className="space-y-3">
          <p className="rounded-md border-2 border-foreground bg-success/15 p-3 font-semibold">
            É proposição ✓: {r.atoms.length === 1 ? "simples (atribua V ou F a p)" : "composta, traduzida abaixo"}
          </p>
          <div className="flex flex-wrap gap-2 font-mono text-sm">
            {r.atoms.map((a, i) => (
              <span key={i} className="rounded-md border-2 border-foreground bg-secondary px-2.5 py-1">
                <strong>{NL_VARS[i]}</strong> = “{sup(a)}”
              </span>
            ))}
          </div>
          <p className="font-mono text-lg font-bold">{r.formula}</p>
          {r.note && <p className="text-sm text-muted-foreground">{r.note}</p>}
          {parsed && (parsed.err
            ? <p className="text-destructive">{parsed.err}</p>
            : parsed.n && <TruthTable n={parsed.n} formula={r.formula} />)}
        </div>
      )}
    </div>
  );
}

const SPECS = [
  { id: "I", label: "p ∨ q: mensagem armazenada OU retransmitida", formula: "p ∨ q" },
  { id: "II", label: "¬p: mensagem NÃO está no buffer", formula: "¬p" },
  { id: "III", label: "p → q: se armazenada, será retransmitida", formula: "p → q" },
  { id: "IV (extra)", label: "¬q: mensagem NÃO é retransmitida (torna inconsistente)", formula: "¬q" },
];

function Consistencia() {
  const [on, setOn] = useState<boolean[]>([true, true, true, false]);
  const nodes = SPECS.map((s) => tryParse(s.formula));
  const allOk = nodes.every((x) => x.n);
  const vs = ["p", "q"];
  const rs = rows(vs);
  const sat = allOk ? rs.filter((env) => nodes.every((x, i) => !on[i] || evaluate(x.n!, env))) : [];
  return (
    <section id="consistencia" className="card-ink scroll-mt-24 p-6">
      <h2 className="text-3xl font-bold">Especificações consistentes?</h2>
      <p className="text-muted-foreground">p: “mensagem armazenada no buffer” · q: “mensagem retransmitida”. Marque os requisitos e veja se existe uma linha que satisfaz todos.</p>
      <div className="mt-3 grid gap-2">
        {SPECS.map((s, i) => (
          <label key={s.id} className="flex cursor-pointer items-center gap-3 rounded-md border-2 border-foreground bg-card px-3 py-2 font-mono text-sm">
            <input type="checkbox" checked={on[i]} onChange={() => setOn((v) => v.map((x, j) => (j === i ? !x : x)))} className="h-4 w-4" />
            <span><strong>{s.id}</strong> · {s.label} · <strong>{s.formula}</strong></span>
          </label>
        ))}
      </div>
      <p className={`mt-4 rounded-md border-2 border-foreground p-3 font-semibold ${sat.length ? "bg-success text-primary-foreground" : "bg-destructive text-primary-foreground"}`}>
        {sat.length ? `Consistente ✓. Ex.: ${sat.map((e) => `p=${e["p"] ? "V" : "F"},q=${e["q"] ? "V" : "F"}`).slice(0, 2).join(" · ")}` : "Inconsistente ✗: nenhum p,q satisfaz tudo ao mesmo tempo"}
      </p>
      <div className="mt-3 overflow-x-auto rounded-lg border-2 border-foreground">
        <table className="w-full text-center font-mono text-sm">
          <thead className="bg-primary text-primary-foreground">
            <tr><th className="px-2 py-2">p</th><th className="px-2 py-2">q</th>{SPECS.map((s, i) => on[i] && <th key={s.id} className="px-2 py-2">{s.formula}</th>)}</tr>
          </thead>
          <tbody>
            {rs.map((env, i) => (
              <tr key={i} className="border-t border-border even:bg-secondary/50">
                <td className="px-2 py-1.5">{env["p"] ? "V" : "F"}</td>
                <td className="px-2 py-1.5">{env["q"] ? "V" : "F"}</td>
                {SPECS.map((s, j) => on[j] && nodes[j]?.n && <td key={s.id} className="px-2 py-1.5 font-semibold">{evaluate(nodes[j]!.n!, env) ? "V" : "F"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const DEMOS = [
  {
    titulo: "Modus ponens",
    forma: "Se p então q · p · logo q",
    formula: "((p → q) ∧ p) → q",
  },
  {
    titulo: "Modus tollens",
    forma: "Se p então q · não q · logo não p",
    formula: "((p → q) ∧ ¬q) → ¬p",
  },
  {
    titulo: "Silogismo hipotético",
    forma: "Se p então q · se q então r · logo se p então r",
    formula: "((p → q) ∧ (q → r)) → (p → r)",
  },
];

function Demonstracoes() {
  const [idx, setIdx] = useState(0);
  const t = DEMOS[idx]!;
  const parsed = tryParse(t.formula);
  return (
    <section id="demonstracoes" className="card-ink scroll-mt-24 p-6">
      <h2 className="text-3xl font-bold">Técnicas de demonstração</h2>
      <p className="text-muted-foreground">Um argumento válido é uma tautologia: as premissas nunca são V com a conclusão F. Confira na última coluna.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {DEMOS.map((x, i) => (
          <button key={x.titulo} onClick={() => setIdx(i)} className={`btn-ink px-3 py-1 text-sm ${i === idx ? "bg-primary text-primary-foreground" : "bg-card"}`}>{x.titulo}</button>
        ))}
      </div>
      <div className="mt-4 rounded-lg border-2 border-foreground bg-secondary p-4">
        <p className="italic">{t.forma}</p>
        <p className="mt-1 font-mono text-lg font-bold">{t.formula}</p>
      </div>
      {parsed.err ? <p className="mt-3 text-destructive">{parsed.err}</p> : parsed.n && <div className="mt-4"><TruthTable n={parsed.n} formula={t.formula} /></div>}
    </section>
  );
}

function Argumentos() {
  const [prem, setPrem] = useState("p → q\np");
  const [conc, setConc] = useState("q");
  const linhas = useMemo(() => prem.split("\n").map((l) => l.trim()).filter(Boolean), [prem]);
  const pars = useMemo(() => linhas.map((l) => tryParse(l)), [linhas]);
  const pc = useMemo(() => tryParse(conc.trim() === "" ? "??" : conc.trim()), [conc]);
  const erros = pars.map((p, i) => (p.err ? `Premissa ${i + 1}: ${p.err}` : null)).filter((x): x is string => !!x);
  const nodes = pars.map((p) => p.n).filter((x): x is Node => !!x);
  const pronto = nodes.length > 0 && nodes.length === linhas.length && pc.n !== undefined;
  const formula = useMemo(() => {
    if (!pronto || !pc.n) return null;
    let acc = nodes[0]!;
    for (let i = 1; i < nodes.length; i++) acc = { t: "bin", op: "and", a: acc, b: nodes[i]! };
    return { t: "bin", op: "imp", a: acc, b: pc.n } as Node;
  }, [pronto, nodes, pc]);
  const contra = useMemo(() => {
    if (!formula || !pronto || !pc.n) return undefined;
    const v = vars(formula);
    for (const env of rows(v)) {
      if (nodes.every((x) => evaluate(x, env)) && !evaluate(pc.n!, env)) return env;
    }
    return null;
  }, [formula, pronto, nodes, pc]);
  return (
    <section id="argumentos" className="card-ink scroll-mt-24 space-y-4 p-6">
      <h2 className="text-3xl font-bold">Verificador de argumentos</h2>
      <p className="text-muted-foreground">Escreva uma premissa por linha e a conclusão. O site diz se o argumento é válido e mostra o contraexemplo quando não é.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="font-semibold">Premissas (uma por linha)</span>
          <textarea className="field-ink mt-1 min-h-20 text-lg" rows={3} value={prem} onChange={(e) => setPrem(e.target.value)} spellCheck={false} />
        </label>
        <label className="block">
          <span className="font-semibold">Conclusão</span>
          <input className="field-ink mt-1 text-lg" value={conc} onChange={(e) => setConc(e.target.value)} spellCheck={false} />
        </label>
      </div>
      {erros.map((e) => (
        <p key={e} className="rounded-md bg-destructive/10 p-3 text-destructive">{e}</p>
      ))}
      {pc.err && conc.trim() !== "" && (
        <p className="rounded-md bg-destructive/10 p-3 text-destructive">Conclusão: {pc.err}</p>
      )}
      {pronto && contra === null && (
        <p className="rounded-md border-2 border-foreground bg-success p-3 font-semibold text-primary-foreground">
          Argumento válido ✓: as premissas nunca são V com a conclusão F (é tautologia).
        </p>
      )}
      {pronto && contra && (
        <div className="rounded-md border-2 border-foreground bg-destructive p-3 font-semibold text-primary-foreground">
          <p>Argumento inválido ✗: existe caso com premissas V e conclusão F.</p>
          <p className="mt-1 font-mono text-sm">
            Contraexemplo: {vars(formula!).map((v) => `${v}=${contra[v] ? "V" : "F"}`).join(", ")}
          </p>
        </div>
      )}
      {formula && <TruthTable n={formula} formula={show(formula)} />}
    </section>
  );
}

function Lacunas() {
  const [src, setSrc] = useState("(p ∧ q) → r");
  const [seed, setSeed] = useState(7);
  const [palp, setPalp] = useState<Record<string, boolean>>({});
  const [conf, setConf] = useState(false);
  const { n, err } = useMemo(() => tryParse(src), [src]);
  const vs = n ? vars(n) : [];
  const cols = n ? subexprs(n) : [];
  const rs = rows(vs);
  useEffect(() => {
    setPalp({});
    setConf(false);
  }, [src, seed]);
  const brancos = useMemo(() => {
    if (!n) return [] as string[];
    const out: string[] = [];
    rs.forEach((_, i) => {
      cols.forEach((_, j) => {
        if ((i * 31 + j * 17 + seed) % 3 === 0) out.push(`${i}-${j}`);
      });
    });
    return out.slice(0, 12);
  }, [n, rs, cols, seed]);
  const valor = (i: number, j: number) => evaluate(cols[j!]!, rs[i!]!);
  const acertos = brancos.filter((k) => {
    const [i, j] = k.split("-").map(Number) as [number, number];
    return palp[k] !== undefined && palp[k] === valor(i, j);
  }).length;
  const alternar = (k: string) => {
    setPalp((v) => {
      if (v[k] === undefined) return { ...v, [k]: true };
      if (v[k]) return { ...v, [k]: false };
      const next = { ...v };
      delete next[k];
      return next;
    });
  };
  return (
    <section id="lacunas" className="card-ink scroll-mt-24 space-y-4 p-6">
      <h2 className="text-3xl font-bold">Complete as lacunas</h2>
      <p className="text-muted-foreground">Aperte as células com “?” para marcar V ou F e confira no final. Vale ponto só com a tabela inteira certa na cabeça.</p>
      <label className="block">
        <span className="font-semibold">Proposição</span>
        <input className="field-ink mt-1 text-lg" value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} />
      </label>
      {err ? (
        <p className="rounded-md bg-destructive/10 p-3 text-destructive">{err}</p>
      ) : cols.length === 0 ? (
        <p className="text-muted-foreground">Digite uma fórmula com conectivo para gerar lacunas.</p>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border-2 border-foreground">
            <table className="w-full text-center font-mono">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  {vs.map((v) => <th key={v} className="px-3 py-2">{v}</th>)}
                  {cols.map((c, j) => <th key={j} className="whitespace-nowrap px-3 py-2">{show(c)}</th>)}
                </tr>
              </thead>
              <tbody>
                {rs.map((env, i) => (
                  <tr key={i} className="border-t border-border even:bg-secondary/50">
                    {vs.map((v) => <td key={v} className="px-3 py-1.5">{env[v] ? "V" : "F"}</td>)}
                    {cols.map((c, j) => {
                      const v = evaluate(c, env);
                      const k = `${i}-${j}`;
                      const branco = brancos.includes(k);
                      if (!branco) {
                        return <td key={j} className="px-3 py-1.5 text-muted-foreground">{v ? "V" : "F"}</td>;
                      }
                      if (conf) {
                        const ok = palp[k] === v;
                        return (
                          <td key={j} className={`px-3 py-1.5 font-bold ${ok ? "bg-success/25 text-success" : "bg-destructive/25 text-destructive"}`}>
                            {v ? "V" : "F"}
                          </td>
                        );
                      }
                      const p = palp[k];
                      return (
                        <td key={j} className="px-3 py-1.5">
                          <button onClick={() => alternar(k)} aria-label={`Célula linha ${i + 1}, marcar valor`}
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border-2 border-foreground font-bold ${p === undefined ? "bg-card" : p ? "bg-success text-primary-foreground" : "bg-destructive text-primary-foreground"}`}>
                            {p === undefined ? "?" : p ? "V" : "F"}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={() => setSeed(Math.floor(Math.random() * 1000))}>Sortear lacunas</button>
            <button className="btn-ink bg-primary px-3 py-1 text-sm text-primary-foreground" onClick={() => setConf(true)}>Conferir</button>
            <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={() => { setPalp({}); setConf(false); }}>Limpar</button>
            {conf && (
              <span className="rounded-md border-2 border-foreground bg-secondary px-3 py-1 text-sm font-semibold">
                {acertos} de {brancos.length} lacunas certas
              </span>
            )}
          </div>
        </div>
      )}
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
    <section id="quantificadores" className="card-ink scroll-mt-24 p-6">
      <h2 className="text-3xl font-bold">Sentenças abertas e quantificadores</h2>
      <p className="text-muted-foreground">
        “{p.txt}” não é proposição, pois depende de x. Ao aplicar <strong>∀</strong> (para todo) ou <strong>∃</strong> (existe), ela vira proposição.
      </p>
      <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
        <div className="rounded-md border-2 border-foreground bg-secondary p-3"><strong>Variável livre:</strong> em <span className="font-mono">x &gt; 0</span>, x pode variar.</div>
        <div className="rounded-md border-2 border-foreground bg-secondary p-3"><strong>Variável presa:</strong> em <span className="font-mono">∃y (y &gt; x)</span>, y está no escopo do ∃; x continua livre.</div>
        <div className="rounded-md border-2 border-foreground bg-secondary p-3"><strong>2 jeitos de virar proposição:</strong> atribuir valor (x=3) ou quantificar (∀x / ∃x). Ex. triângulos: <span className="font-mono">∀T (T retângulo → Pitágoras)</span>.</div>
      </div>
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
