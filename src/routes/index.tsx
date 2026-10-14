import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LógiCo — Aprenda Lógica e Conjuntos brincando" },
      { name: "description", content: "Laboratório interativo de Teoria dos Conjuntos, proposições, conectivos e tabelas-verdade." },
      { property: "og:title", content: "LógiCo — Aprenda Lógica e Conjuntos brincando" },
      { property: "og:description", content: "Diagramas de Venn, tabelas-verdade automáticas e desafios com pontuação." },
    ],
  }),
  component: Index,
});

const CARDS = [
  { to: "/conjuntos", sym: "A ∩ B", title: "Laboratório de Conjuntos", text: "Monte conjuntos, veja o Diagrama de Venn reagir e teste pertinência (∈) e inclusão (⊂).", tone: "bg-set-a" },
  { to: "/logica", sym: "p → q", title: "Máquina da Verdade", text: "Digite qualquer proposição e gere a tabela-verdade, classifique e compare equivalências.", tone: "bg-accent" },
  { to: "/quiz", sym: "∀ ∃", title: "Desafio Relâmpago", text: "Frase ou proposição? Quantificadores, conectivos e operações valendo pontos e sequência.", tone: "bg-success" },
] as const;

function Index() {
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
            <Link to="/quiz" className="btn-ink bg-card">Ir para o desafio</Link>
          </div>
        </div>
        <Venn />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="card-ink group p-6 transition-transform hover:-translate-y-1">
            <div className={`inline-block rounded-md border-2 border-foreground px-3 py-1 font-mono text-lg font-semibold text-primary-foreground ${c.tone}`}>{c.sym}</div>
            <h2 className="mt-4 text-2xl font-bold">{c.title}</h2>
            <p className="mt-2 text-muted-foreground">{c.text}</p>
            <span className="mt-4 inline-block font-semibold text-primary group-hover:underline">Abrir →</span>
          </Link>
        ))}
      </section>

      <section className="card-ink grid gap-6 p-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Por que conjuntos importam na computação?</h2>
          <p className="mt-3 text-muted-foreground">
            Todo programa é uma sequência de bits — ou seja, um número inteiro. Já os problemas computacionais se
            relacionam com os números reais, cuja cardinalidade é <strong>maior</strong>.
          </p>
        </div>
        <div className="space-y-3 font-mono text-sm">
          <div className="rounded-md border-2 border-foreground bg-secondary p-3">|Programas| = |ℕ| = ℵ₀</div>
          <div className="rounded-md border-2 border-foreground bg-secondary p-3">|Problemas| = |ℝ| = 2^ℵ₀ &gt; ℵ₀</div>
          <div className="rounded-md border-2 border-foreground bg-accent p-3 text-accent-foreground">
            ∴ existem problemas sem solução — ex.: o Problema da Parada
          </div>
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
      <text x="80" y="130" className="fill-current font-display text-2xl font-bold">A</text>
      <text x="225" y="130" className="fill-current font-display text-2xl font-bold">B</text>
      <text x="160" y="130" textAnchor="middle" className="fill-current font-mono text-xs">A∩B</text>
    </svg>
  );
}
