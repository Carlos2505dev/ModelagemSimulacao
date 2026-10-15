import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre · LógiCo" },
      { name: "description", content: "Por que o LógiCo existe, quem fez e com quais tecnologias. Trabalho AV3 da Unijorge." },
      { property: "og:title", content: "Sobre · LógiCo" },
      { property: "og:description", content: "App educativo de lógica e conjuntos feito por estudantes da Unijorge." },
    ],
  }),
  component: Sobre,
});

const EQUIPE = [
  { nome: "Caio Ricardo", papel: "Laboratório de Conjuntos e apresentação", foto: "/team/caio.png", iniciais: "CR" },
  { nome: "Carlos Bezerra", papel: "Máquina da Verdade e tabelas-verdade", foto: "/team/carlos.jpg", iniciais: "CB" },
  { nome: "David Souza", papel: "Equivalências e consistência", foto: "/team/david.jpg", iniciais: "DS" },
  { nome: "Davi Hiel", papel: "Quantificadores e tradutor", foto: "/team/hiel.png", iniciais: "DH" },
  { nome: "Marcos Antônio", papel: "Banco de questões e documentação", foto: "/team/marcos.jpg", iniciais: "MA" },
];

function Foto({ foto, iniciais, nome }: { foto: string; iniciais: string; nome: string }) {
  const [quebrou, setQuebrou] = useState(false);
  return (
    <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-foreground bg-primary font-mono text-3xl font-extrabold text-primary-foreground">
      {quebrou ? (
        iniciais
      ) : (
        <img src={foto} alt={`Foto de ${nome}`} className="h-full w-full object-cover" onError={() => setQuebrou(true)} />
      )}
    </div>
  );
}

function Sobre() {
  return (
    <div className="space-y-12">
      <header className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-mono text-sm font-semibold text-accent">O Projeto e a Equipe</p>
          <h1 className="mt-2 flex items-center gap-3 text-4xl font-extrabold md:text-5xl">
            Sobre o LógiCo
            <img src="/favicon.ico" alt="Ícone LógiCo" className="h-10 w-10 rounded-lg object-contain md:h-12 md:w-12" />
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Um app educativo que ensina lógica matemática e teoria dos conjuntos brincando,
            criado como avaliação da disciplina pelo professor Marcelo Lopes.
          </p>
        </div>
        <div className="card-ink flex items-center gap-4 p-5">
          <img src="/Unijorge.png" alt="Logo da Unijorge" className="h-20 w-20 rounded-lg bg-white object-contain p-1" />
          <div>
            <p className="font-display text-2xl font-extrabold">Unijorge</p>
            <p className="max-w-45 text-sm text-muted-foreground">Trabalho elaborado para a disciplina do curso de tecnologia.</p>
          </div>
        </div>
      </header>

      <section className="card-ink space-y-5 p-6 md:p-8">
        <h2 className="text-3xl font-bold">Por que este site existe?</h2>
        <p>
          A proposta da AV3 é direta: <strong>criar um APP educativo que aborde, de forma lúdica e dinâmica,
          conceitos de lógica matemática e teoria dos conjuntos</strong>. A disciplina mostra que esses temas
          estão em todo lugar: a teoria dos conjuntos revela os limites do que um computador pode fazer
          (programas cabem nos inteiros, problemas nos reais, por isso existe o Problema da Parada),
          e a lógica é a base de todo algoritmo, do if ao banco de dados.
        </p>
        <p className="text-muted-foreground">
          O LógiCo transforma essas ideias abstratas em experiências manipuláveis: diagramas que reagem,
          tabelas que se calculam sozinhas e questões com gabarito comentado.
        </p>
      </section>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-3xl font-bold">Equipe LógiCO</h2>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPE.map((p) => (
            <article key={p.nome} className="card-ink p-6 text-center">
              <Foto foto={p.foto} iniciais={p.iniciais} nome={p.nome} />
              <h3 className="mt-4 text-xl font-bold">{p.nome}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.papel}</p>
            </article>
          ))}
          <article className="card-ink flex flex-col justify-center p-6 text-center">
            <p className="font-mono text-sm font-semibold text-accent">E O PROFESSOR</p>
            <h3 className="mt-2 text-xl font-bold">Marcelo Lopes</h3>
            <p className="mt-1 text-sm text-muted-foreground">Orientação e avaliação do trabalho</p>
          </article>
        </div>
      </section>

      <section className="card-ink p-6 md:p-8">
        <h2 className="text-3xl font-bold">Ficha técnica</h2>
        <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <li className="rounded-md border-2 border-foreground bg-secondary p-3"><strong>Tecnologia:</strong> feito com React, a mesma base de muitos sites modernos.</li>
          <li className="rounded-md border-2 border-foreground bg-secondary p-3"><strong>Contas:</strong> tudo é calculado no seu aparelho, então funciona mesmo com internet fraca.</li>
          <li className="rounded-md border-2 border-foreground bg-secondary p-3"><strong>Desenhos:</strong> vetoriais, por isso ficam nítidos em qualquer tela.</li>
          <li className="rounded-md border-2 border-foreground bg-secondary p-3"><strong>Progresso:</strong> o que você responde no banco fica guardado no seu dispositivo.</li>
        </ul>
        <Link to="/documentacao" className="mt-4 inline-block font-semibold text-primary hover:underline">
          Ver a documentação completa do projeto →
        </Link>
      </section>

      <section className="card-ink p-8 text-center">
        <h2 className="text-3xl font-bold">Agora que já nos conhece, bora estudar?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/conjuntos" className="btn-ink bg-primary text-primary-foreground">Começar pelo básico</Link>
          <Link to="/quiz" className="btn-ink bg-card">Ir ao banco de questões</Link>
        </div>
      </section>
    </div>
  );
}
