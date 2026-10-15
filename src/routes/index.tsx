import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { s?: string } => {
    if (typeof search["s"] === "string") return { s: search["s"] };
    return {};
  },
  head: () => ({
    meta: [
      { title: "LógiCo · Aprenda Lógica e Conjuntos brincando" },
      { name: "description", content: "Laboratório interativo de Teoria dos Conjuntos, proposições, conectivos e tabelas-verdade." },
      { property: "og:title", content: "LógiCo · Aprenda Lógica e Conjuntos brincando" },
      { property: "og:description", content: "Diagramas de Venn, tabelas-verdade automáticas e banco de questões." },
    ],
  }),
  component: Index,
});

const CARDS = [
  { to: "/conjuntos", sym: "A ∩ B", title: "Laboratório de Conjuntos", text: "Monte conjuntos, veja o Diagrama de Venn reagir e teste pertinência (∈) e inclusão (⊂).", tone: "bg-set-a" },
  { to: "/logica", sym: "p → q", title: "Máquina da Verdade", text: "Digite qualquer proposição e gere a tabela-verdade, classifique e compare equivalências.", tone: "bg-accent" },
  { to: "/aplicacoes", sym: "if (p)", title: "Aplicações", text: "Onde tudo isso aparece na engenharia: software, chips, dados, código e limites do computador.", tone: "bg-primary" },
  { to: "/quiz", sym: "Q1 Q2 Q3", title: "Banco de Questões", text: "Treine por conteúdo e dificuldade, com gabarito e comentário em cada questão.", tone: "bg-success" },
] as const;

const TRILHA = [
  { n: "01", to: "/conjuntos", title: "Monte conjuntos", text: "Defina U, A e B e veja o Venn acender em cada operação." },
  { n: "02", to: "/logica", title: "Gere tabelas", text: "Escreva em português ou em símbolos e receba a tabela pronta." },
  { n: "03", to: "/aplicacoes", title: "Veja onde usa", text: "Do requisito ambíguo ao chip: a matéria na vida real." },
  { n: "04", to: "/quiz", title: "Treine no banco", text: "35 questões filtradas por tema e nível, com comentário." },
] as const;

const STATS = [
  ["7", "operações de conjuntos"],
  ["5", "conectivos lógicos"],
  ["6", "aplicações reais"],
  ["35", "questões no banco"],
] as const;

const MINI = [
  ["V", "V", "V"],
  ["V", "F", "F"],
  ["F", "V", "V"],
  ["F", "F", "V"],
] as const;

function Index() {
  const { s } = Route.useSearch();
  useEffect(() => {
    if (!s) return;
    const t = setTimeout(() => document.getElementById(s)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    return () => clearTimeout(t);
  }, [s]);
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] md:text-6xl">
            A matemática por trás de <span className="underline decoration-accent decoration-4 underline-offset-8">todo programa</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Explore Teoria dos Conjuntos e Lógica Matemática de forma lúdica: arraste ideias, quebre proposições e
            descubra por que existem problemas que nenhum computador resolve.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/conjuntos" className="btn-ink bg-primary text-primary-foreground">Começar a explorar</Link>
            <Link to="/quiz" className="btn-ink bg-card">Ir para o banco</Link>
          </div>
        </div>
        <Venn />
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="card-ink group p-6 transition-transform hover:-translate-y-1">
            <div className={`inline-block rounded-md border-2 border-foreground px-3 py-1 font-mono text-lg font-semibold text-primary-foreground ${c.tone}`}>{c.sym}</div>
            <h2 className="mt-4 text-2xl font-bold">{c.title}</h2>
            <p className="mt-2 text-muted-foreground">{c.text}</p>
            <span className="mt-4 inline-block font-semibold text-primary group-hover:underline">Abrir →</span>
          </Link>
        ))}
      </section>

      <section className="card-ink p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-3xl font-bold">Siga a trilha</h2>
          <span className="font-mono text-sm text-muted-foreground">do primeiro conjunto ao gabarito</span>
        </div>
        <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TRILHA.map((t) => (
            <li key={t.n} className="rounded-lg border-2 border-foreground bg-secondary p-4">
              <span className="font-mono text-sm font-bold text-accent">{t.n}</span>
              <Link to={t.to} className="mt-1 block text-lg font-bold hover:underline">{t.title} →</Link>
              <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-3xl font-bold">Olha a máquina trabalhando</h2>
          <p className="mt-3 text-muted-foreground">
            Para <span className="font-mono">p → q</span>, a tabela sai sozinha, com cada
            subexpressão calculada e a classificação no topo. Vale para qualquer fórmula que você digitar.
          </p>
          <Link to="/logica" search={{ f: "p → q", s: "maquina" }} className="btn-ink mt-6 bg-primary text-primary-foreground">
            Abrir a Máquina da Verdade
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg border-2 border-foreground">
          <table className="w-full text-center font-mono">
            <thead className="bg-primary text-primary-foreground">
              <tr><th className="px-3 py-2">p</th><th className="px-3 py-2">q</th><th className="bg-accent px-3 py-2">p → q</th></tr>
            </thead>
            <tbody>
              {MINI.map((row, i) => (
                <tr key={i} className="border-t border-border even:bg-secondary/50">
                  <td className="px-3 py-1.5">{row[0]}</td>
                  <td className="px-3 py-1.5">{row[1]}</td>
                  <td className={`bg-accent/10 px-3 py-1.5 font-semibold ${row[2] === "V" ? "text-success" : "text-destructive"}`}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(([n, label]) => (
          <div key={label} className="card-ink p-5 text-center">
            <div className="font-mono text-4xl font-extrabold text-accent">{n}</div>
            <div className="mt-1 text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </section>

      <section id="limites" className="card-ink grid scroll-mt-24 gap-6 p-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Por que conjuntos importam na computação?</h2>
          <p className="mt-3 text-muted-foreground">
            Todo programa é uma sequência de bits, ou seja, um número inteiro. Já os problemas computacionais se
            relacionam com os números reais, cuja cardinalidade é <strong>maior</strong>.
          </p>
        </div>
        <div className="space-y-3 font-mono text-sm">
          <div className="rounded-md border-2 border-foreground bg-secondary p-3">|Programas| = |ℕ| = ℵ₀</div>
          <div className="rounded-md border-2 border-foreground bg-secondary p-3">|Problemas| = |ℝ| = 2<sup>ℵ₀</sup> &gt; ℵ₀</div>
          <div className="rounded-md border-2 border-foreground bg-accent p-3 text-accent-foreground">
             ∴ existem problemas sem solução, ex.: um antivírus perfeito
          </div>
        </div>
      </section>

      <section className="card-ink p-8 text-center md:p-10">
        <h2 className="text-3xl font-bold md:text-4xl">Bora praticar?</h2>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Teste tudo no banco de questões com gabarito comentado, ou volte às aplicações para ver a teoria em ação.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/quiz" className="btn-ink bg-primary text-primary-foreground">Treinar agora</Link>
          <Link to="/aplicacoes" className="btn-ink bg-card">Ver aplicações</Link>
        </div>
      </section>
    </div>
  );
}

function Venn() {
  return (
    <svg viewBox="0 0 320 240" className="card-ink w-full p-4" role="img" aria-label="Diagrama de Venn A e B">
      <rect x="6" y="6" width="308" height="228" rx="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 5" />
      <text x="18" y="30" className="fill-current font-mono text-sm">U</text>
      <circle cx="125" cy="125" r="78" className="fill-set-a/60 stroke-foreground" strokeWidth="2.5" />
      <circle cx="195" cy="125" r="78" className="fill-set-b/60 stroke-foreground" strokeWidth="2.5" />
      <text x="62" y="42" className="fill-current font-display text-2xl font-bold">A</text>
      <text x="258" y="42" className="fill-current font-display text-2xl font-bold">B</text>
      <text x="160" y="130" textAnchor="middle" className="fill-current font-mono text-xs">A∩B</text>
    </svg>
  );
}
