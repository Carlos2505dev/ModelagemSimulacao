import { useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/aplicacoes")({
  head: () => ({
    meta: [
      { title: "Aplicações na Computação · LógiCo" },
      { name: "description", content: "Onde conjuntos e lógica aparecem na engenharia da computação: software, circuitos, dados, código e limites do computador." },
      { property: "og:title", content: "Aplicações na Computação · LógiCo" },
      { property: "og:description", content: "Do requisito ambíguo ao chip: o que a matéria resolve na vida real." },
    ],
  }),
  component: Aplicacoes,
});

type App = {
  n: string;
  sym: ReactNode;
  tone: string;
  ink: string;
  title: string;
  text: string;
  ex: string;
  to: "/logica" | "/conjuntos" | "/";
  search?: { f?: string; fa?: string; fb?: string; s?: string };
  cta: string;
};

const APPS: App[] = [
  {
    n: "01",
    sym: "q → ¬p",
    tone: "bg-accent",
    ink: "text-accent-foreground",
    title: "Especificação de software",
    text: "Requisitos escritos em português são ambíguos. Traduzidos para proposições, dá para provar que eles não se contradizem antes de escrever uma linha de código.",
    ex: "“Resposta automática não enviada com disco cheio”  =  q → ¬p",
    to: "/logica",
    search: { f: "q → ¬p", s: "maquina" },
    cta: "Testar na máquina →",
  },
  {
    n: "02",
    sym: "∧ ∨ ¬",
    tone: "bg-set-a",
    ink: "text-primary-foreground",
    title: "Circuitos digitais",
    text: "Cada conectivo é uma porta lógica: ∧ é AND, ∨ é OR, ¬ é NOT. A tabela-verdade do app é exatamente o comportamento do chip.",
    ex: "LED acende se (p ∧ ¬q): p = botão, q = trava",
    to: "/logica",
    search: { f: "(p ∧ ¬q)", s: "maquina" },
    cta: "Montar a tabela →",
  },
  {
    n: "03",
    sym: "∪ ∩ −",
    tone: "bg-success",
    ink: "text-primary-foreground",
    title: "Bancos de dados e buscas",
    text: "UNION, INTERSECT e EXCEPT do SQL são união, interseção e diferença. Todo filtro que você escreve é uma operação entre conjuntos.",
    ex: "SELECT * FROM A UNION SELECT * FROM B  =  A ∪ B",
    to: "/conjuntos",
    cta: "Ver no diagrama →",
  },
  {
    n: "04",
    sym: "if (p)",
    tone: "bg-primary",
    ink: "text-primary-foreground",
    title: "O código que você escreve todo dia",
    text: "Todo if e while testa uma proposição. E a lei de De Morgan vira refatoração: trocar !(a && b) por !a || !b deixa a condição legível.",
    ex: "!(a && b)  ⇔  !a || !b",
    to: "/logica",
    search: { fa: "¬(a ∧ b)", fb: "¬a ∨ ¬b", s: "equivalencias" },
    cta: "Provar a equivalência →",
  },
  {
    n: "05",
    sym: <>ℵ₀ &lt; 2<sup>ℵ₀</sup></>,
    tone: "bg-set-a",
    ink: "text-primary-foreground",
    title: "Limites do computador",
    text: "Programas cabem nos inteiros; problemas, nos reais, e há mais reais. Por isso existe problema sem solução, como o Problema da Parada.",
    ex: "|Programas| = |ℕ|  <  |Problemas| = |ℝ|",
    to: "/",
    cta: "Rever a ideia →",
  },
  {
    n: "06",
    sym: "⊢",
    tone: "bg-accent",
    ink: "text-accent-foreground",
    title: "IA e demonstração automática",
    text: "Resolver quebra-cabeças, encadear regras (modus ponens) e provar teoremas sozinho: é lógica proposicional rodando em escala.",
    ex: "((p → q) ∧ p) → q  é tautologia",
    to: "/logica",
    search: { s: "demonstracoes" },
    cta: "Ver demonstrações →",
  },
];

const GATES = [
  { id: "and", sym: "∧", name: "AND", formula: "p ∧ q", run: (p: boolean, q: boolean) => p && q, usesQ: true },
  { id: "or", sym: "∨", name: "OR", formula: "p ∨ q", run: (p: boolean, q: boolean) => p || q, usesQ: true },
  { id: "not", sym: "¬", name: "NOT", formula: "¬p", run: (p: boolean) => !p, usesQ: false },
] as const;

type GateId = (typeof GATES)[number]["id"];

function Circuito() {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);
  const [gate, setGate] = useState<GateId>("and");
  const g = GATES.find((x) => x.id === gate)!;
  const out = g.run(p, q);

  return (
    <section className="card-ink p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-3xl font-bold">Aperte os interruptores</h2>
        <span className="font-mono text-sm text-muted-foreground">mini-simulador de portas lógicas</span>
      </div>
      <p className="mt-2 text-muted-foreground">
        Escolha a porta, ligue e desligue p e q e veja a lâmpada obedecer à tabela-verdade.
      </p>
      <div className="mt-6 grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="mb-2 font-mono text-sm font-semibold">p</div>
            <button onClick={() => setP((v) => !v)} className={`btn-ink w-20 font-mono text-2xl ${p ? "bg-success text-primary-foreground" : "bg-card"}`}>
              {p ? "V" : "F"}
            </button>
          </div>
          <div className={`text-center transition-opacity ${g.usesQ ? "" : "opacity-40"}`}>
            <div className="mb-2 font-mono text-sm font-semibold">q</div>
            <button onClick={() => setQ((v) => !v)} disabled={!g.usesQ} className={`btn-ink w-20 font-mono text-2xl ${q ? "bg-success text-primary-foreground" : "bg-card"}`}>
              {q ? "V" : "F"}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:flex-col">
          {GATES.map((x) => (
            <button key={x.id} onClick={() => setGate(x.id)} className={`btn-ink px-4 py-1 font-mono ${x.id === gate ? "bg-primary text-primary-foreground" : "bg-card"}`}>
              {x.sym} {x.name}
            </button>
          ))}
        </div>
        <div className="text-center">
          <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-foreground font-mono text-3xl font-bold transition-colors ${out ? "bg-success text-primary-foreground" : "bg-secondary"}`}
            style={out ? { boxShadow: "0 0 32px 8px oklch(0.6 0.14 155 / 60%)" } : undefined}>
            <span key={String(out)} className="animate-rise">{out ? "V" : "F"}</span>
          </div>
          <p className="mt-3 font-mono text-lg font-bold">{g.formula} = {out ? "V" : "F"}</p>
          <Link to="/logica" search={{ f: g.formula, s: "maquina" }} className="mt-1 inline-block text-sm font-semibold text-primary hover:underline">
            Ver a tabela completa →
          </Link>
        </div>
      </div>
    </section>
  );
}

const MINI_GATES = [
  { id: "and", sym: "∧", head: ["p", "q", "p ∧ q"], rows: [["V", "V", "V"], ["V", "F", "F"], ["F", "V", "F"], ["F", "F", "F"]] },
  { id: "or", sym: "∨", head: ["p", "q", "p ∨ q"], rows: [["V", "V", "V"], ["V", "F", "V"], ["F", "V", "V"], ["F", "F", "F"]] },
  { id: "not", sym: "¬", head: ["p", "¬p"], rows: [["V", "F"], ["F", "V"]] },
] as const;

function MiniTabela() {
  const [gate, setGate] = useState<(typeof MINI_GATES)[number]["id"]>("and");
  const g = MINI_GATES.find((x) => x.id === gate)!;
  const last = g.head.length - 1;
  return (
    <div className="mt-3 rounded-md border-2 border-foreground bg-secondary p-3">
      <div className="flex gap-2">
        {MINI_GATES.map((x) => (
          <button key={x.id} onClick={() => setGate(x.id)}
            className={`btn-ink px-3 py-1 font-mono text-sm ${x.id === gate ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {x.sym}
          </button>
        ))}
      </div>
      <div key={gate} className="animate-rise mt-2 overflow-x-auto rounded-md border-2 border-foreground">
        <table className="w-full text-center font-mono text-sm">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              {g.head.map((h, i) => (
                <th key={h} className={`px-2 py-1.5 ${i === last ? "bg-accent" : ""}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {g.rows.map((row, i) => (
              <tr key={i} className="border-t border-border bg-card even:bg-secondary/50">
                {row.map((v, j) => (
                  <td key={j} className={`px-2 py-1 font-semibold ${j === last ? (v === "V" ? "text-success" : "text-destructive") : ""}`}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">A tabela é o manual da porta: V acende, F apaga.</p>
    </div>
  );
}

function SpecCheck() {
  const [on, setOn] = useState([true, true, true, false]);
  const reqs = [
    { id: "I", f: "p ∨ q", run: (p: boolean, q: boolean) => p || q },
    { id: "II", f: "¬p", run: (p: boolean) => !p },
    { id: "III", f: "p → q", run: (p: boolean, q: boolean) => !p || q },
    { id: "IV", f: "¬q", run: (p: boolean, q: boolean) => !q },
  ];
  const envs = [[true, true], [true, false], [false, true], [false, false]] as const;
  const testemunha = envs.find(([p, q]) => reqs.every((r, i) => !on[i] || r.run(p, q)));
  const ok = testemunha !== undefined;
  return (
    <div className="mt-3 rounded-md border-2 border-foreground bg-secondary p-3">
      <div className="flex flex-wrap gap-2">
        {reqs.map((r, i) => (
          <button key={r.id} onClick={() => setOn((v) => v.map((x, j) => (j === i ? !x : x)))}
            className={`rounded-md border-2 border-foreground px-2 py-1 font-mono text-sm ${on[i] ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {r.id}: {r.f}
          </button>
        ))}
      </div>
      <div key={String(ok)} className="animate-rise mt-3 flex items-center gap-3 rounded-md border-2 border-foreground bg-card p-3">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-foreground font-mono text-2xl font-bold ${ok ? "bg-success text-primary-foreground" : "bg-destructive text-primary-foreground animate-tremer"}`}
          style={ok ? { boxShadow: "0 0 20px 3px oklch(0.6 0.14 155 / 55%)" } : { boxShadow: "0 0 20px 3px oklch(0.58 0.22 27 / 55%)" }}>
          {ok ? "✓" : "✗"}
        </div>
        <div>
          <p className="font-mono text-sm font-bold">{ok ? "Especificação consistente" : "Especificação quebrou"}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {ok && testemunha
              ? `Testemunha: p=${testemunha[0] ? "V" : "F"}, q=${testemunha[1] ? "V" : "F"} satisfaz tudo`
              : "Nenhum p, q satisfaz todos os requisitos ligados"}
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Ligue o requisito IV e veja o semáforo apagar.</p>
    </div>
  );
}

function DbDemo() {
  const [op, setOp] = useState<"uniao" | "inter" | "dif">("uniao");
  const A = ["1", "2", "3"];
  const B = ["3", "4"];
  const res = op === "uniao" ? [...new Set([...A, ...B])] : op === "inter" ? A.filter((x) => B.includes(x)) : A.filter((x) => !B.includes(x));
  const nomes = { uniao: "UNION", inter: "INTERSECT", dif: "EXCEPT" } as const;
  return (
    <div className="mt-3 rounded-md border-2 border-foreground bg-secondary p-3">
      <p className="font-mono text-xs">A = {"{1, 2, 3}"} · B = {"{3, 4}"}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(nomes) as ("uniao" | "inter" | "dif")[]).map((o) => (
          <button key={o} onClick={() => setOp(o)}
            className={`rounded-md border-2 border-foreground px-2 py-1 font-mono text-xs font-bold ${o === op ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {nomes[o]}
          </button>
        ))}
      </div>
      <div key={op} className="animate-rise mt-2 flex flex-wrap gap-1.5 font-mono text-sm">
        {res.map((x) => (
          <span key={x} className="rounded border-2 border-foreground bg-card px-2 py-0.5">{x}</span>
        ))}
      </div>
    </div>
  );
}

function DeMorgan() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [lado, setLado] = useState(false);
  const valor = !(a && b);
  return (
    <div className="mt-3 rounded-md border-2 border-foreground bg-secondary p-3">
      <div className="flex gap-2">
        <button onClick={() => setA((x) => !x)} className={`btn-ink px-3 py-1 font-mono text-sm ${a ? "bg-success text-primary-foreground" : "bg-card"}`}>
          a = {a ? "V" : "F"}
        </button>
        <button onClick={() => setB((x) => !x)} className={`btn-ink px-3 py-1 font-mono text-sm ${b ? "bg-success text-primary-foreground" : "bg-card"}`}>
          b = {b ? "V" : "F"}
        </button>
      </div>
      <button key={`${lado}-${valor}`} onClick={() => setLado((x) => !x)}
        className="animate-rise mt-2 w-full rounded-md border-2 border-foreground bg-card px-2 py-1.5 font-mono text-sm">
        {lado ? "!a || !b" : "!(a && b)"} = <strong>{valor ? "V" : "F"}</strong>
      </button>
      <p className="mt-2 text-xs text-muted-foreground">Aperte a fórmula para trocar de lado. O valor nunca muda.</p>
    </div>
  );
}

function Limites() {
  const [go, setGo] = useState(false);
  return (
    <div className="mt-3 rounded-md border-2 border-foreground bg-secondary p-3 font-mono text-xs">
      <div className="flex items-center gap-2">
        <span className="w-6 font-bold">ℕ</span>
        <div className="h-5 flex-1 overflow-hidden rounded border border-foreground/30">
          <div className="h-full bg-set-a transition-all duration-1000" style={{ width: go ? "38%" : "6%" }} />
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="w-6 font-bold">ℝ</span>
        <div className="h-5 flex-1 overflow-hidden rounded border border-foreground/30">
          <div className="h-full bg-accent transition-all duration-1000" style={{ width: go ? "100%" : "6%" }} />
        </div>
        {go && <span className="animate-rise font-bold text-accent">transborda!</span>}
      </div>
      <button onClick={() => setGo((x) => !x)} className="btn-ink mt-3 bg-card px-3 py-1 font-sans text-xs font-semibold">
        {go ? "Recolher" : "Comparar infinitos"}
      </button>
    </div>
  );
}

const PASSOS_IA = ["p → q  (a regra)", "p  (o fato)", "∴ q  (a conclusão)"];

function IaSteps() {
  const [n, setN] = useState(1);
  return (
    <div className="mt-3 rounded-md border-2 border-foreground bg-secondary p-3">
      <ol className="space-y-1.5 font-mono text-sm">
        {PASSOS_IA.slice(0, n).map((p) => (
          <li key={p} className="animate-rise rounded border border-foreground/30 bg-card px-2 py-1">{p}</li>
        ))}
      </ol>
      <div className="mt-2">
        {n < PASSOS_IA.length ? (
          <button onClick={() => setN(n + 1)} className="btn-ink bg-card px-3 py-1 text-xs">Próximo passo</button>
        ) : (
          <button onClick={() => setN(1)} className="btn-ink bg-card px-3 py-1 text-xs">Recomeçar</button>
        )}
      </div>
    </div>
  );
}

function Aplicacoes() {
  return (
    <div className="space-y-12">
      <header>
        <p className="font-mono text-sm font-semibold text-accent">Da Sala para o Mundo Real</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Onde isso aparece na computação?</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Conjuntos e lógica não são teoria solta: são a ferramenta que especifica software,
          desenha chips, consulta dados e prova o que nenhum computador resolve.
        </p>
      </header>

      <Circuito />

      <section className="grid gap-6 md:grid-cols-2">
        {APPS.map((a) => (
          <article key={a.title} className="card-ink flex flex-col p-6">
            <div className="flex items-start justify-between">
              <div className={`rounded-md border-2 border-foreground px-3 py-1 font-mono text-lg font-semibold ${a.tone} ${a.ink}`}>
                {a.sym}
              </div>
              <span className="font-mono text-sm text-muted-foreground">{a.n}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold">{a.title}</h2>
            <p className="mt-2 text-muted-foreground">{a.text}</p>
            <p className="mt-3 rounded-md border-2 border-foreground bg-secondary p-3 font-mono text-sm">{a.ex}</p>
            {a.n === "01" ? <SpecCheck />
              : a.n === "02" ? <MiniTabela />
              : a.n === "03" ? <DbDemo />
              : a.n === "04" ? <DeMorgan />
              : a.n === "05" ? <Limites />
              : a.n === "06" ? <IaSteps />
              : null}
            {a.to === "/logica" ? (
              <Link to="/logica" search={a.search ?? {}} className="mt-4 inline-block self-start font-semibold text-primary hover:underline">
                {a.cta}
              </Link>
            ) : a.to === "/conjuntos" ? (
              <Link to="/conjuntos" search={{ op: "uniao" }} className="mt-4 inline-block self-start font-semibold text-primary hover:underline">
                {a.cta}
              </Link>
            ) : (
              <Link to="/" search={{ s: "limites" }} className="mt-4 inline-block self-start font-semibold text-primary hover:underline">
                {a.cta}
              </Link>
            )}
          </article>
        ))}
      </section>

      <section className="card-ink p-8 text-center">
        <h2 className="text-3xl font-bold">Aprendeu onde usa? Agora prove que sabe.</h2>
        <p className="mt-2 text-muted-foreground">35 questões no banco, com gabarito e comentário em cada uma.</p>
        <Link to="/quiz" className="btn-ink mt-6 bg-primary text-primary-foreground">
          Ir para o Desafio Relâmpago
        </Link>
      </section>
    </div>
  );
}
