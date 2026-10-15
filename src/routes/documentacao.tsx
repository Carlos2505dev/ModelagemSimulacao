import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/documentacao")({
  head: () => ({
    meta: [
      { title: "Documentação do Projeto · LógiCo" },
      { name: "description", content: "Idealização, objetivos, etapas e arquitetura do app educativo LógiCo (AV3)." },
      { property: "og:title", content: "Documentação do Projeto · LógiCo" },
      { property: "og:description", content: "Descrição escrita das etapas do projeto do app educativo." },
    ],
  }),
  component: Doc,
});

const ETAPAS = [
  ["Escolha do tema", "A equipe escolheu os dois tópicos: teoria elementar dos conjuntos e noções de lógica com técnicas de demonstração."],
  ["Idealização", "Público-alvo: estudantes de tecnologia. Proposta: aprender fazendo, com feedback visual imediato e gamificação."],
  ["Planejamento", "Cada objetivo da AV3 foi mapeado para um módulo do app, com a identidade visual de caderno quadriculado."],
  ["Construção", "App web em React com motor lógico próprio, diagramas de Venn em SVG e tudo calculado no navegador."],
  ["Testes", "Tabelas conferidas contra leis conhecidas (De Morgan, contrapositiva, silogismo) e testes de uso."],
  ["Apresentação", "Demonstração em sala: cada integrante apresenta um módulo e o banco é jogado com a turma."],
];

const MAPA = [
  { obj: "Conjuntos no raciocínio lógico, proposições e conectivos", to: "/conjuntos", cta: "Abrir o laboratório" },
  { obj: "Elementos, tipos, pertinência, inclusão e operações", to: "/conjuntos", cta: "Testar o Venn" },
  { obj: "Frase contra proposição, conectivos e quantificadores", to: "/quiz", cta: "Treinar no banco" },
  { obj: "Tabelas-verdade, análise e equivalências lógicas", to: "/logica", cta: "Gerar uma tabela" },
] as const;

const PONTOS = [
  ["2,0", "Parte escrita", "ideia, documentação e etapas do projeto"],
  ["2,0", "Ideia e construção", "o app funcionando no navegador"],
  ["3,0", "Apresentação", "com a maioria da equipe apresentando"],
] as const;

function Doc() {
  return (
    <article className="space-y-12">
      <header>
        <p className="font-mono text-sm font-semibold text-accent">Do Plano à Entrega</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Documentação do Projeto</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          AV3 de Modelagem e Simulação Matemática com o professor Marcelo Lopes. Aqui está o que foi pedido,
          o que foi construído e onde cada parte mora dentro do app.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {PONTOS.map(([n, titulo, detalhe]) => (
          <div key={titulo} className="card-ink p-5 text-center">
            <div className="font-mono text-4xl font-extrabold text-accent">{n}</div>
            <div className="mt-1 font-bold">{titulo}</div>
            <div className="mt-1 text-sm text-muted-foreground">{detalhe}</div>
          </div>
        ))}
      </section>

      <section className="card-ink p-6 md:p-8">
        <h2 className="text-3xl font-bold">A Ideia</h2>
        <p className="mt-3">
          A teoria dos conjuntos mostra os limites da computação: programas têm a cardinalidade de ℕ, enquanto problemas
          têm a de ℝ, por isso existem problemas sem solução. A lógica, por sua vez, é a base de todo
          algoritmo. O LógiCo transforma essas ideias abstratas em experiências que dá para mexer com o dedo.
        </p>
      </section>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-3xl font-bold">Cada Objetivo Mora Num Módulo</h2>
          <span className="font-mono text-sm text-muted-foreground">aperte para visitar</span>
        </div>
        <ol className="mt-6 space-y-4">
          {MAPA.map((m, i) => (
            <li key={m.obj} className="card-ink flex flex-wrap items-center gap-4 p-5">
              <span className="font-mono text-2xl font-extrabold text-accent">0{i + 1}</span>
              <p className="min-w-52 flex-1 font-medium">{m.obj}</p>
              <Link to={m.to} className="font-semibold text-primary hover:underline">{m.cta} →</Link>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-3xl font-bold">Como Foi Feito, Passo A Passo</h2>
        <ol className="mt-6 space-y-0">
          {ETAPAS.map(([t, d], i) => (
            <li key={t} className="relative flex gap-4 pb-6 last:pb-0">
              {i < ETAPAS.length - 1 && <span aria-hidden className="absolute left-5 top-12 h-full w-0.5 bg-border" />}
              <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-primary font-mono font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div className="card-ink flex-1 p-5">
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="mt-1 text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card-ink p-6 md:p-8">
        <h2 className="text-3xl font-bold">Por Dentro Do Código</h2>
        <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <li className="rounded-md border-2 border-foreground bg-secondary p-3">Página carrega só o que usa: abertura rápida.</li>
          <li className="rounded-md border-2 border-foreground bg-secondary p-3">Contas 100% no aparelho: resposta na hora, mesmo com internet fraca.</li>
          <li className="rounded-md border-2 border-foreground bg-secondary p-3">Digitação fluida na tabela, sem travar a cada letra.</li>
          <li className="rounded-md border-2 border-foreground bg-secondary p-3">Desenhos vetoriais: nítidos em qualquer tela.</li>
          <li className="rounded-md border-2 border-foreground bg-secondary p-3">Progresso do banco guardado no dispositivo.</li>
          <li className="rounded-md border-2 border-foreground bg-secondary p-3">Claro e escuro com o mesmo cuidado de contraste.</li>
        </ul>
      </section>

      <section className="card-ink p-8 text-center">
        <h2 className="text-3xl font-bold">Fim Do Papel, Hora Da Prática</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-ink bg-primary text-primary-foreground">Voltar ao início</Link>
          <Link to="/sobre" className="btn-ink bg-card">Conhecer a equipe</Link>
        </div>
      </section>
    </article>
  );
}
