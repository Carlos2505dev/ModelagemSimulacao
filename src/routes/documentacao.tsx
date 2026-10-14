import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/documentacao")({
  head: () => ({
    meta: [
      { title: "Documentação do Projeto — LógiCo" },
      { name: "description", content: "Idealização, objetivos, etapas e arquitetura do app educativo LógiCo (AV3)." },
      { property: "og:title", content: "Documentação do Projeto — LógiCo" },
      { property: "og:description", content: "Descrição escrita das etapas do projeto do app educativo." },
    ],
  }),
  component: Doc,
});

const ETAPAS = [
  ["1. Escolha do tema", "Equipe escolheu os dois tópicos: Teoria elementar dos conjuntos e Noções de lógica e técnicas de demonstração."],
  ["2. Idealização", "Público-alvo: estudantes de tecnologia. Proposta: aprender fazendo, com feedback visual imediato e gamificação."],
  ["3. Planejamento", "Mapeamento de cada objetivo da AV3 a um módulo do app (tabela abaixo) e definição da identidade visual “caderno quadriculado”."],
  ["4. Construção", "Desenvolvimento web com React + TanStack Start, motor lógico próprio (parser recursivo) e diagramas de Venn em SVG."],
  ["5. Testes", "Validação das tabelas-verdade com leis conhecidas (De Morgan, contrapositiva, silogismo hipotético) e testes de usabilidade."],
  ["6. Apresentação", "Demonstração em sala: cada integrante apresenta um módulo e o quiz é jogado com a turma."],
];

const MAPA = [
  ["Obj. 1 — Conjuntos no raciocínio lógico; proposições e conectivos", "Laboratório de Conjuntos + cartões de conectivos"],
  ["Obj. 2 — Conjuntos, tipos, pertinência, inclusão e operações", "Laboratório de Conjuntos (Venn, ∈, ⊂, ∪, ∩, −, Δ, ᶜ, 𝒫(A))"],
  ["Obj. 3 — Frase × proposição, conectivos, quantificadores", "Quiz (frase × proposição) + módulo ∀ / ∃ com sentenças abertas"],
  ["Obj. 4 — Tabelas-verdade e equivalências", "Máquina da Verdade: tabela automática, classificação e comparador ⇔"],
];

function Doc() {
  return (
    <article className="space-y-10">
      <header>
        <h1 className="text-4xl font-extrabold md:text-5xl">Documentação do Projeto</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          AV3 · Modelagem e Simulação Matemática · Prof. Marcelo Lopes. O LógiCo é um app educativo que aborda de forma lúdica e
          dinâmica conceitos de lógica matemática e teoria dos conjuntos.
        </p>
      </header>

      <section className="card-ink p-6">
        <h2 className="text-2xl font-bold">Justificativa</h2>
        <p className="mt-2">
          A teoria dos conjuntos mostra os limites da computação: programas têm a cardinalidade de ℕ, enquanto problemas
          têm a de ℝ — logo existem problemas insolúveis, como o Problema da Parada. A lógica, por sua vez, é a base de todo
          algoritmo. O app transforma essas ideias abstratas em experiências manipuláveis.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Objetivos × Módulos</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border-2 border-foreground bg-card">
          <table className="w-full text-left">
            <thead className="bg-primary text-primary-foreground"><tr><th className="p-3">Objetivo da AV3</th><th className="p-3">Como o app aborda</th></tr></thead>
            <tbody>{MAPA.map(([a, b]) => <tr key={a} className="border-t border-border"><td className="p-3">{a}</td><td className="p-3 font-medium">{b}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Etapas do projeto</h2>
        <ol className="mt-3 grid gap-4 md:grid-cols-2">
          {ETAPAS.map(([t, d]) => <li key={t} className="card-ink p-5"><h3 className="text-lg font-bold">{t}</h3><p className="mt-1 text-muted-foreground">{d}</p></li>)}
        </ol>
      </section>

      <section className="card-ink p-6">
        <h2 className="text-2xl font-bold">Decisões técnicas e desempenho</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Renderização no servidor e divisão automática de código por página: carregamento rápido.</li>
          <li>Cálculos 100% no navegador, sem servidor: resposta instantânea e funciona com internet fraca.</li>
          <li>Entrada da tabela-verdade adiada (useDeferredValue) para digitação fluida.</li>
          <li>Gráficos em SVG vetorial: nítidos em qualquer tela e leves.</li>
          <li>Recorde do quiz salvo localmente no dispositivo.</li>
        </ul>
      </section>

      <section className="card-ink p-6">
        <h2 className="text-2xl font-bold">Equipe</h2>
        <p className="mt-2 text-muted-foreground">Preencha com os nomes dos 4 a 6 integrantes da equipe.</p>
        <ul className="mt-3 grid gap-2 font-mono sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => <li key={n} className="rounded-md border-2 border-dashed border-foreground/40 p-2">Integrante {n}</li>)}
        </ul>
      </section>
    </article>
  );
}
