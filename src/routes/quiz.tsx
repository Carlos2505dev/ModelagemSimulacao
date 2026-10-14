import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Desafio Relâmpago — LógiCo" },
      { name: "description", content: "Quiz gamificado de lógica matemática e teoria dos conjuntos com pontuação e recorde." },
      { property: "og:title", content: "Desafio Relâmpago — LógiCo" },
      { property: "og:description", content: "Teste seus conhecimentos de conjuntos, proposições e conectivos." },
    ],
  }),
  component: Quiz,
});

type Q = { tema: string; q: string; ops: string[]; a: number; why: string };
const BANCO: Q[] = [
  { tema: "Frase × Proposição", q: "“Que horas são?” é uma proposição?", ops: ["Sim", "Não"], a: 1, why: "Perguntas não podem ser V ou F." },
  { tema: "Frase × Proposição", q: "“Brasília é a capital do Brasil.” é uma proposição?", ops: ["Sim", "Não"], a: 0, why: "É declarativa e tem valor lógico (V)." },
  { tema: "Frase × Proposição", q: "“x + 2 = 5” é…", ops: ["Proposição", "Sentença aberta", "Tautologia"], a: 1, why: "Depende do valor de x." },
  { tema: "Frase × Proposição", q: "“Feche a porta!” é…", ops: ["Proposição verdadeira", "Proposição falsa", "Não é proposição"], a: 2, why: "Ordens não possuem valor lógico." },
  { tema: "Conjuntos", q: "A = {1,2,3}, B = {3,4}. A ∪ B = ?", ops: ["{3}", "{1,2,3,4}", "{1,2}", "{1,2,3,3,4}"], a: 1, why: "União reúne todos, sem repetição." },
  { tema: "Conjuntos", q: "A = {1,2,3}, B = {3,4}. A ∩ B = ?", ops: ["{3}", "∅", "{1,2,3,4}", "{4}"], a: 0, why: "Só o 3 está em ambos." },
  { tema: "Conjuntos", q: "A = {a,b,c}, B = {b}. A − B = ?", ops: ["{b}", "{a,c}", "{a,b,c}", "∅"], a: 1, why: "Remove de A o que está em B." },
  { tema: "Conjuntos", q: "Qual símbolo relaciona ELEMENTO e conjunto?", ops: ["⊂", "∈", "∪", "="], a: 1, why: "∈ é pertinência; ⊂ é inclusão." },
  { tema: "Conjuntos", q: "Quantos subconjuntos tem A = {1,2,3}?", ops: ["3", "6", "8", "9"], a: 2, why: "|𝒫(A)| = 2³ = 8." },
  { tema: "Conjuntos", q: "∅ ⊂ A para todo conjunto A?", ops: ["Verdadeiro", "Falso"], a: 0, why: "O vazio é subconjunto de qualquer conjunto." },
  { tema: "Conjuntos", q: "Na computação, o conjunto dos programas tem a mesma cardinalidade de…", ops: ["ℝ", "ℕ", "∅", "ℂ"], a: 1, why: "Todo programa pode ser codificado como um inteiro." },
  { tema: "Conectivos", q: "p = V, q = F. Qual o valor de p ∧ q?", ops: ["V", "F"], a: 1, why: "Conjunção exige ambas V." },
  { tema: "Conectivos", q: "p = F, q = F. Qual o valor de p → q?", ops: ["V", "F"], a: 0, why: "Condicional só é F em V → F." },
  { tema: "Conectivos", q: "p = V, q = F. Qual o valor de p → q?", ops: ["V", "F"], a: 1, why: "Antecedente V e consequente F." },
  { tema: "Conectivos", q: "p ∨ ¬p é…", ops: ["Contradição", "Tautologia", "Contingência"], a: 1, why: "Sempre verdadeira." },
  { tema: "Conectivos", q: "¬(p ∧ q) é equivalente a…", ops: ["¬p ∧ ¬q", "¬p ∨ ¬q", "p ∨ q", "p → q"], a: 1, why: "Lei de De Morgan." },
  { tema: "Conectivos", q: "A contrapositiva de p → q é…", ops: ["q → p", "¬p → ¬q", "¬q → ¬p", "p ∧ ¬q"], a: 2, why: "Equivalente à original." },
  { tema: "Conectivos", q: "Quantas linhas tem a tabela-verdade com 3 variáveis?", ops: ["3", "6", "8", "9"], a: 2, why: "2³ = 8." },
  { tema: "Quantificadores", q: "∀x ∈ ℕ, x ≥ 0 é…", ops: ["V", "F"], a: 0, why: "Todo natural é não negativo." },
  { tema: "Quantificadores", q: "A negação de “∀x, P(x)” é…", ops: ["∀x, ¬P(x)", "∃x, ¬P(x)", "∃x, P(x)", "¬∃x, P(x)"], a: 1, why: "Basta um contraexemplo." },
  { tema: "Quantificadores", q: "∃x ∈ {1,3,5}, x é par é…", ops: ["V", "F"], a: 1, why: "Nenhum elemento é par." },
];

const N = 10;
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

function Quiz() {
  const [qs, setQs] = useState<Q[]>([]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    setQs(shuffle(BANCO).slice(0, N));
    setBest(Number(localStorage.getItem("logico-best") || 0));
  }, []);

  const done = qs.length > 0 && i >= qs.length;
  useEffect(() => {
    if (done && score > best) { setBest(score); localStorage.setItem("logico-best", String(score)); }
  }, [done, score, best]);

  const restart = () => { setQs(shuffle(BANCO).slice(0, N)); setI(0); setPick(null); setScore(0); setStreak(0); };

  if (!qs.length) return <div className="card-ink p-8">Carregando desafio…</div>;

  if (done) {
    const pct = Math.round((score / (N * 15)) * 100);
    return (
      <div className="card-ink mx-auto max-w-lg p-10 text-center">
        <h1 className="mt-2 text-5xl font-extrabold">{score} pts</h1>
        <p className="mt-2 text-muted-foreground">Aproveitamento ≈ {pct}% · Recorde: {best} pts</p>
        <p className="mt-4 text-lg">{pct >= 80 ? "Mestre da Lógica! 🏆" : pct >= 50 ? "Mandou bem! Continue praticando." : "Revise o Laboratório e tente de novo!"}</p>
        <button className="btn-ink mt-6 bg-primary text-primary-foreground" onClick={restart}>Jogar novamente</button>
      </div>
    );
  }

  const q = qs[i]!;
  const answer = (k: number) => {
    if (pick !== null) return;
    setPick(k);
    if (k === q.a) { setScore((s) => s + 10 + Math.min(streak, 5)); setStreak((s) => s + 1); } else setStreak(0);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-sm">
        <span>Questão {i + 1}/{N}</span>
        <span>🔥 sequência {streak}</span>
        <span className="font-semibold">{score} pts · recorde {best}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full border-2 border-foreground bg-card">
        <div className="h-full bg-accent transition-all" style={{ width: `${(i / N) * 100}%` }} />
      </div>
      <div className="card-ink p-8">
        <span className="rounded border-2 border-foreground bg-secondary px-2 py-0.5 text-xs font-semibold">{q.tema}</span>
        <h1 className="mt-4 text-2xl font-bold md:text-3xl">{q.q}</h1>
        <div className="mt-6 grid gap-3">
          {q.ops.map((o, k) => {
            const state = pick === null ? "bg-card" : k === q.a ? "bg-success text-primary-foreground" : k === pick ? "bg-destructive text-primary-foreground" : "bg-card opacity-60";
            return <button key={k} onClick={() => answer(k)} className={`btn-ink justify-start text-left font-mono ${state}`}>{o}</button>;
          })}
        </div>
        {pick !== null && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-foreground bg-secondary p-4">
            <p><strong>{pick === q.a ? "Correto!" : "Ops!"}</strong> {q.why}</p>
            <button className="btn-ink bg-primary text-primary-foreground" onClick={() => { setI(i + 1); setPick(null); }}>
              {i + 1 === N ? "Ver resultado" : "Próxima →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
