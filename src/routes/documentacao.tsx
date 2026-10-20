import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import documentoOficial from "../../Materiais/Documentação.pdf?url";

export const Route = createFileRoute("/documentacao")({
  head: () => ({
    meta: [
      { title: "Documentação do Projeto · LógiCo" },
      {
        name: "description",
        content: "Idealização, objetivos, etapas e arquitetura do app educativo LógiCo (AV3).",
      },
      { property: "og:title", content: "Documentação do Projeto · LógiCo" },
      {
        property: "og:description",
        content: "Descrição escrita das etapas do projeto do app educativo.",
      },
    ],
  }),
  component: Doc,
});

const SECOES = [
  ["1", "Introdução", "introducao"],
  ["2", "Fundamentação teórica", "fundamentacao"],
  ["3", "O LógiCo", "projeto"],
  ["3.1", "Metodologia e etapas", "metodologia"],
  ["3.2", "Funcionamento da plataforma", "funcionamento"],
  ["4", "Resultados obtidos", "resultados"],
  ["5", "Referências", "referencias"],
] as const;

const MODULOS = [
  {
    nome: "Laboratório de Conjuntos",
    conteudo: "Elementos, relações entre conjuntos, operações e diagramas de Venn.",
    to: "/conjuntos",
    acao: "Abrir conjuntos",
  },
  {
    nome: "Máquina da Verdade",
    conteudo: "Proposições, conectivos, tabelas-verdade, equivalências e quantificadores.",
    to: "/logica",
    acao: "Abrir lógica",
  },
  {
    nome: "Aplicações",
    conteudo: "Relações entre os conceitos matemáticos e situações da computação.",
    to: "/aplicacoes",
    acao: "Ver aplicações",
  },
  {
    nome: "Banco de Questões",
    conteudo: "Exercícios com gabaritos e comentários explicativos.",
    to: "/quiz",
    acao: "Acessar questões",
  },
] as const;

const ETAPAS = [
  [
    "Pesquisa e levantamento dos conteúdos",
    "Definição dos tópicos de Matemática Discreta, lógica proposicional, conjuntos, equivalências, tabelas-verdade, quantificadores e demonstrações.",
  ],
  [
    "Planejamento e definição da proposta",
    "Estabelecimento dos objetivos, do público-alvo e da estrutura da plataforma educativa.",
  ],
  [
    "Organização do conteúdo e das telas",
    "Distribuição dos assuntos entre os módulos e planejamento da hierarquia das informações e interações.",
  ],
  [
    "Desenvolvimento da interface",
    "Construção dos elementos visuais e da navegação para aproximar os conceitos das ferramentas.",
  ],
  [
    "Implementação das funcionalidades",
    "Desenvolvimento do processamento de expressões, cálculos e apresentação dos resultados.",
  ],
  [
    "Testes, validação e correções",
    "Verificação das tabelas-verdade, equivalências, classificações, leis de De Morgan, entradas e navegação.",
  ],
  [
    "Publicação e disponibilização",
    "Publicação da plataforma na Vercel para acesso por navegador, sem instalação local.",
  ],
] as const;

function Doc() {
  return (
    <article className="space-y-10">
      <header className="grid gap-8 border-b-2 border-foreground pb-8 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end">
        <div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            Documentação oficial do LógiCo
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Lógica e conjuntos de forma lúdica. Registro do projeto acadêmico, de seus fundamentos
            matemáticos à publicação da plataforma.
          </p>
          <a
            href={documentoOficial}
            download="Documentacao-oficial-Logico.pdf"
            className="btn-ink mt-6 bg-primary text-primary-foreground"
          >
            <ArrowDownToLine size={18} aria-hidden="true" />
            Baixar PDF oficial
          </a>
        </div>
        <dl className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-foreground/30 pt-4 text-sm md:grid-cols-1">
          <div>
            <dt className="text-muted-foreground">Instituição</dt>
            <dd className="mt-0.5 font-semibold">Universidade Jorge Amado</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Curso e disciplina</dt>
            <dd className="mt-0.5 font-semibold">
              Engenharia da Computação · Modelagem e Simulação Matemática
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Turma · Salvador, BA</dt>
            <dd className="mt-0.5 font-mono font-semibold">42ECP01N4A · 2026</dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <aside className="self-start lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Neste documento</h2>
          <nav
            aria-label="Seções da documentação"
            className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-y border-foreground/30 py-3 lg:grid-cols-1"
          >
            {SECOES.map(([numero, titulo, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex min-h-9 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="w-7 shrink-0 font-mono text-xs text-accent">{numero}</span>
                <span>{titulo}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 max-w-3xl space-y-12">
          <section id="introducao" className="scroll-mt-28 space-y-4">
            <SectionHeading numero="1" titulo="Introdução" />
            <p className="leading-relaxed">
              Matemática Discreta e Lógica Matemática são fundamentos para algoritmos, softwares e
              sistemas computacionais. Como esses conteúdos podem ser abstratos, o projeto propõe
              uma forma visual e participativa de estudá-los.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              O LógiCo reúne explicações, exemplos, exercícios e ferramentas de experimentação para
              apoiar a compreensão e a aplicação de conceitos de Teoria dos Conjuntos e Lógica
              Matemática.
            </p>
          </section>

          <section id="fundamentacao" className="scroll-mt-28 space-y-5">
            <SectionHeading numero="2" titulo="Fundamentação teórica" />
            <p className="leading-relaxed text-muted-foreground">
              A documentação apresenta os conceitos matemáticos que orientam os conteúdos e as
              ferramentas da plataforma.
            </p>
            <dl className="divide-y divide-foreground/20 border-y border-foreground/30">
              <TheoryRow
                termo="Teoria dos conjuntos"
                detalhe="Pertinência (∈), não pertinência (∉), inclusão (⊆), conjunto vazio (∅) e operações de união, interseção e diferença, representadas com diagramas de Venn."
              />
              <TheoryRow
                termo="Lógica proposicional"
                detalhe="Proposições verdadeiras ou falsas e os conectivos de negação (¬), conjunção (∧), disjunção (∨), condicional (→) e bicondicional (↔)."
              />
              <TheoryRow
                termo="Tabelas-verdade"
                detalhe="Combinações dos valores lógicos, classificação em tautologia, contradição ou contingência e análise de expressões compostas."
              />
              <TheoryRow
                termo="Quantificadores"
                detalhe="Universal (∀, “para todo”) e existencial (∃, “existe pelo menos um”), aplicados a propriedades em um domínio."
              />
              <TheoryRow
                termo="Equivalências lógicas"
                detalhe="Expressões com os mesmos valores lógicos em todas as combinações, incluindo as Leis de De Morgan e a equivalência do condicional."
              />
            </dl>
          </section>

          <section id="projeto" className="scroll-mt-28 space-y-5">
            <SectionHeading numero="3" titulo="O LógiCo" />
            <p className="leading-relaxed">
              O LógiCo é uma plataforma web educativa desenvolvida por estudantes de Engenharia da
              Computação para aproximar conceitos de Matemática Discreta de situações da computação.
              O público descrito no relatório inclui estudantes de graduação, alunos de cursos
              técnicos e pessoas interessadas em computação e ciências exatas.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              A estrutura descrita no documento oficial se organiza em quatro módulos. Cada link
              abaixo abre a área correspondente da plataforma.
            </p>
            <ul className="divide-y divide-foreground/20 border-y border-foreground/30">
              {MODULOS.map((modulo) => (
                <li
                  key={modulo.nome}
                  className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div>
                    <h3 className="font-bold">{modulo.nome}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {modulo.conteudo}
                    </p>
                  </div>
                  <Link
                    to={modulo.to}
                    className="inline-flex min-h-9 items-center gap-1 font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {modulo.acao}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section id="metodologia" className="scroll-mt-28 space-y-5">
            <SectionHeading numero="3.1" titulo="Metodologia e etapas do projeto" />
            <p className="leading-relaxed text-muted-foreground">
              O relatório descreve um processo que parte do levantamento dos conteúdos e da proposta
              educacional, passa pela implementação e validação, e termina com a publicação da
              plataforma.
            </p>
            <ol className="divide-y divide-foreground/20 border-y border-foreground/30">
              {ETAPAS.map(([titulo, detalhe], indice) => (
                <li key={titulo} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
                  <span className="font-mono text-sm font-bold text-accent">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-bold">{titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detalhe}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="funcionamento" className="scroll-mt-28 space-y-5">
            <SectionHeading numero="3.2" titulo="Desenvolvimento e funcionamento" />
            <p className="leading-relaxed">
              A plataforma integra a interface usada pelo estudante ao processamento das entradas e
              à apresentação dos resultados. Na Máquina da Verdade, a pessoa informa uma proposição
              composta e consulta sua tabela-verdade, classificação e equivalências.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              O relatório também descreve atividades de consistência entre condições e preenchimento
              de tabelas, diagramas de Venn no Laboratório de Conjuntos, domínios numéricos
              ajustáveis para quantificadores e tradução de frases cotidianas para a lógica
              proposicional.
            </p>
            <Link
              to="/logica"
              className="inline-flex min-h-10 items-center gap-2 font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Explorar a Máquina da Verdade <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </section>

          <section id="resultados" className="scroll-mt-28 space-y-5">
            <SectionHeading numero="4" titulo="Resultados obtidos" />
            <p className="leading-relaxed">
              Segundo o relatório, o resultado foi uma plataforma web publicada para apoiar o estudo
              de Lógica Proposicional e Teoria dos Conjuntos, com ferramentas de experimentação e
              conteúdos organizados por módulos.
            </p>
            <ul className="list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground marker:text-accent">
              <li>
                Geração de tabelas-verdade, análise de equivalências e verificação de argumentos com
                contraexemplos.
              </li>
              <li>
                Tradução de frases para a lógica proposicional e exploração de quantificadores com
                domínios numéricos ajustáveis.
              </li>
              <li>
                Validação descrita com fórmulas, equivalências, Leis de De Morgan, Modus Ponens e
                Modus Tollens.
              </li>
              <li>
                Uso de representações visuais e interação para tornar conceitos abstratos mais
                observáveis.
              </li>
            </ul>
          </section>

          <section
            id="referencias"
            className="scroll-mt-28 space-y-4 border-t-2 border-foreground pt-6"
          >
            <SectionHeading numero="5" titulo="Referências" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              LÓGICO · LÓGICA E CONJUNTOS DE FORMA LÚDICA.{" "}
              <cite className="not-italic">Lógica Matemática.</cite> Disponível em:{" "}
              <a
                href="https://logicomatematica.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="break-all font-semibold text-primary underline underline-offset-4"
              >
                https://logicomatematica.vercel.app/
              </a>
              . Acesso em: 20 de outubro de 2026.
            </p>
            <a
              href={documentoOficial}
              download="Documentacao-oficial-Logico.pdf"
              className="inline-flex min-h-10 items-center gap-2 font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowDownToLine size={16} aria-hidden="true" />
              Baixar a documentação oficial em PDF
            </a>
          </section>
        </div>
      </div>
    </article>
  );
}

function SectionHeading({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-2xl font-bold md:text-3xl">
      <span className="font-mono text-sm font-semibold text-accent">{numero}</span>
      {titulo}
    </h2>
  );
}

function TheoryRow({ termo, detalhe }: { termo: string; detalhe: string }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-5">
      <dt className="font-semibold">{termo}</dt>
      <dd className="text-sm leading-relaxed text-muted-foreground">{detalhe}</dd>
    </div>
  );
}
