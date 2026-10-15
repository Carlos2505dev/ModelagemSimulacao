import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Timer, Zap } from "lucide-react";
import { Confetes } from "../components/Confetes";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Banco de Questões · LógiCo" },
      { name: "description", content: "Banco de questões de lógica matemática e teoria dos conjuntos com filtros por conteúdo e dificuldade." },
      { property: "og:title", content: "Banco de Questões · LógiCo" },
      { property: "og:description", content: "Treine por conteúdo e dificuldade, com gabarito e comentário." },
    ],
  }),
  component: Quiz,
});

type Nivel = "facil" | "medio" | "dificil";
type Q = { tema: string; nivel: Nivel; q: string; ops: string[]; a: number; why: string };

const BANCO: Q[] = [
  { tema: "Frase × Proposição", nivel: "facil", q: "“Que horas são?” é uma proposição?", ops: ["Sim", "Não"], a: 1, why: "Perguntas não podem ser V ou F." },
  { tema: "Frase × Proposição", nivel: "facil", q: "“Brasília é a capital do Brasil.” é uma proposição?", ops: ["Sim", "Não"], a: 0, why: "É declarativa e tem valor lógico (V)." },
  { tema: "Frase × Proposição", nivel: "medio", q: "“x + 2 = 5” é…", ops: ["Proposição", "Sentença aberta", "Tautologia"], a: 1, why: "Depende do valor de x." },
  { tema: "Frase × Proposição", nivel: "facil", q: "“Feche a porta!” é…", ops: ["Proposição verdadeira", "Proposição falsa", "Não é proposição"], a: 2, why: "Ordens não possuem valor lógico." },
  { tema: "Conjuntos", nivel: "facil", q: "A = {1,2,3}, B = {3,4}. A ∪ B = ?", ops: ["{3}", "{1,2,3,4}", "{1,2}", "{1,2,3,3,4}"], a: 1, why: "União reúne todos, sem repetição." },
  { tema: "Conjuntos", nivel: "facil", q: "A = {1,2,3}, B = {3,4}. A ∩ B = ?", ops: ["{3}", "∅", "{1,2,3,4}", "{4}"], a: 0, why: "Só o 3 está em ambos." },
  { tema: "Conjuntos", nivel: "facil", q: "A = {a,b,c}, B = {b}. A − B = ?", ops: ["{b}", "{a,c}", "{a,b,c}", "∅"], a: 1, why: "Remove de A o que está em B." },
  { tema: "Conjuntos", nivel: "facil", q: "Qual símbolo relaciona ELEMENTO e conjunto?", ops: ["⊂", "∈", "∪", "="], a: 1, why: "∈ é pertinência; ⊂ é inclusão." },
  { tema: "Conjuntos", nivel: "medio", q: "Quantos subconjuntos tem A = {1,2,3}?", ops: ["3", "6", "8", "9"], a: 2, why: "|𝒫(A)| = 2³ = 8." },
  { tema: "Conjuntos", nivel: "medio", q: "∅ ⊂ A para todo conjunto A?", ops: ["Verdadeiro", "Falso"], a: 0, why: "O vazio é subconjunto de qualquer conjunto." },
  { tema: "Conjuntos", nivel: "dificil", q: "Na computação, o conjunto dos programas tem a mesma cardinalidade de…", ops: ["ℝ", "ℕ", "∅", "ℂ"], a: 1, why: "Todo programa pode ser codificado como um inteiro." },
  { tema: "Conjuntos", nivel: "medio", q: "U = {1,2,3,4}, B = {2,4}. Bᶜ = ?", ops: ["{2,4}", "{1,3}", "{1,2,3,4}", "∅"], a: 1, why: "Complemento: elementos de U fora de B." },
  { tema: "Conectivos", nivel: "facil", q: "p = V, q = F. Qual o valor de p ∧ q?", ops: ["V", "F"], a: 1, why: "Conjunção exige ambas V." },
  { tema: "Conectivos", nivel: "medio", q: "p = F, q = F. Qual o valor de p → q?", ops: ["V", "F"], a: 0, why: "Condicional só é F em V → F." },
  { tema: "Conectivos", nivel: "facil", q: "p = V, q = F. Qual o valor de p → q?", ops: ["V", "F"], a: 1, why: "Antecedente V e consequente F." },
  { tema: "Conectivos", nivel: "medio", q: "p ∨ ¬p é…", ops: ["Contradição", "Tautologia", "Contingência"], a: 1, why: "Sempre verdadeira." },
  { tema: "Conectivos", nivel: "medio", q: "¬(p ∧ q) é equivalente a…", ops: ["¬p ∧ ¬q", "¬p ∨ ¬q", "p ∨ q", "p → q"], a: 1, why: "Lei de De Morgan." },
  { tema: "Conectivos", nivel: "dificil", q: "A contrapositiva de p → q é…", ops: ["q → p", "¬p → ¬q", "¬q → ¬p", "p ∧ ¬q"], a: 2, why: "Equivalente à original." },
  { tema: "Conectivos", nivel: "facil", q: "Quantas linhas tem a tabela-verdade com 3 variáveis?", ops: ["3", "6", "8", "9"], a: 2, why: "2³ = 8." },
  { tema: "Quantificadores", nivel: "facil", q: "∀x ∈ ℕ, x ≥ 0 é…", ops: ["V", "F"], a: 0, why: "Todo natural é não negativo." },
  { tema: "Quantificadores", nivel: "medio", q: "A negação de “∀x, P(x)” é…", ops: ["∀x, ¬P(x)", "∃x, ¬P(x)", "∃x, P(x)", "¬∃x, P(x)"], a: 1, why: "Basta um contraexemplo." },
  { tema: "Quantificadores", nivel: "facil", q: "∃x ∈ {1,3,5}, x é par é…", ops: ["V", "F"], a: 1, why: "Nenhum elemento é par." },
  { tema: "Quantificadores", nivel: "medio", q: "Em “∃y (y > x)”, qual variável é livre?", ops: ["y", "x", "Ambas"], a: 1, why: "y está presa ao ∃; x pode variar." },
  { tema: "Princípios", nivel: "facil", q: "“p ∨ ¬p” é sempre V por qual princípio?", ops: ["Identidade", "Não-contradição", "Terceiro excluído"], a: 2, why: "Toda proposição é V ou F, sem terceiro valor." },
  { tema: "Princípios", nivel: "facil", q: "Uma proposição pode ser V e F ao mesmo tempo?", ops: ["Sim", "Não"], a: 1, why: "Princípio da não-contradição." },
  { tema: "Tradução", nivel: "medio", q: "q: sistema cheio · p: resposta pode ser enviada. “q → ¬p” significa…", ops: ["Se o sistema está cheio, a resposta não é enviada", "Se a resposta é enviada, o sistema está cheio", "O sistema nunca fica cheio"], a: 0, why: "Condicional: antecedente V e consequente F a falsificaria." },
  { tema: "Consistência", nivel: "medio", q: "p∨q, ¬p e p→q são satisfeitas ao mesmo tempo quando…", ops: ["p=V, q=V", "p=F, q=V", "p=V, q=F"], a: 1, why: "Única linha que satisfaz as três, por isso a especificação é consistente." },
  { tema: "Consistência", nivel: "dificil", q: "Acrescentar ¬q à especificação acima a torna…", ops: ["Consistente", "Inconsistente"], a: 1, why: "Nenhuma linha satisfaz as quatro ao mesmo tempo." },
  { tema: "Conjuntos", nivel: "medio", q: "A = {1,2,3}, B = {3,4}. A Δ B = ?", ops: ["{3}", "{1,2,4}", "{1,2,3,4}", "∅"], a: 1, why: "Diferença simétrica: em um ou outro, mas não em ambos." },
  { tema: "Demonstrações", nivel: "facil", q: "De “p → q” e “p”, o que se conclui?", ops: ["q", "¬q", "¬p"], a: 0, why: "Modus ponens: afirmando o antecedente." },
  { tema: "Conectivos", nivel: "dificil", q: "“((p → q) ∧ p) → q” é…", ops: ["Tautologia", "Contradição", "Contingência"], a: 0, why: "Modus ponens: sempre verdadeira." },
  { tema: "Conectivos", nivel: "dificil", q: "p ↔ q é F quando…", ops: ["p=V, q=V", "p=V, q=F", "p=F, q=F"], a: 1, why: "Bicondicional só é F com valores diferentes." },
  { tema: "Demonstrações", nivel: "dificil", q: "De “p → q” e “¬q”, o que se conclui?", ops: ["q", "¬p", "p"], a: 1, why: "Modus tollens: negando o consequente." },
  { tema: "Quantificadores", nivel: "dificil", q: "A negação de “∃x, P(x)” é…", ops: ["∀x, P(x)", "∀x, ¬P(x)", "∃x, ¬P(x)"], a: 1, why: "Se nenhum exemplo existe, para todo x vale o contrário." },
  { tema: "Conjuntos", nivel: "dificil", q: "Se |A| = 3 e |B| = 2, o maior valor possível de |A ∪ B| é…", ops: ["5", "6", "3"], a: 0, why: "Com A e B disjuntos, soma tudo: 3 + 2." },
];

const TEMAS = [...new Set(BANCO.map((q) => q.tema))];
const NIVEIS: { id: Nivel; label: string; badge: string }[] = [
  { id: "facil", label: "Fácil", badge: "bg-success text-primary-foreground" },
  { id: "medio", label: "Médio", badge: "bg-accent text-accent-foreground" },
  { id: "dificil", label: "Difícil", badge: "bg-destructive text-primary-foreground" },
];
const LETRAS = ["A", "B", "C", "D", "E"];

function badgeNivel(n: Nivel): string {
  return NIVEIS.find((x) => x.id === n)!.badge;
}

function labelNivel(n: Nivel): string {
  return NIVEIS.find((x) => x.id === n)!.label;
}

function QuestionCard({ id, n, reveal, marcada, escolha, onPick, onResponder, onRefazer }: {
  id: number;
  n: number;
  reveal: boolean;
  marcada: number | undefined;
  escolha: number | undefined;
  onPick: (id: number, k: number) => void;
  onResponder: (id: number) => void;
  onRefazer: (id: number) => void;
}) {
  const q = BANCO[id]!;
  const respondida = marcada !== undefined;
  const mostra = respondida || reveal;
  return (
    <article className="card-ink p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="font-mono text-muted-foreground">Q{n}</span>
        <span className="rounded border-2 border-foreground bg-secondary px-2 py-0.5">{q.tema}</span>
        <span className={`rounded border-2 border-foreground px-2 py-0.5 ${badgeNivel(q.nivel)}`}>{labelNivel(q.nivel)}</span>
        {respondida && (
          <span className={`rounded border-2 border-foreground px-2 py-0.5 ${marcada === q.a ? "bg-success text-primary-foreground" : "bg-destructive text-primary-foreground"}`}>
            {marcada === q.a ? "Acertou ✓" : "Errou ✗"}
          </span>
        )}
      </div>
      <h2 className="mt-3 text-xl font-bold md:text-2xl">{q.q}</h2>
      <div className="mt-4 grid gap-2">
        {q.ops.map((o, k) => {
          const certa = k === q.a;
          const escolhida = respondida ? k === marcada : k === escolha;
          const cls = mostra
            ? certa
              ? "bg-success text-primary-foreground"
              : escolhida
                ? "bg-destructive text-primary-foreground"
                : "bg-card opacity-60"
            : escolhida
              ? "bg-primary text-primary-foreground"
              : "bg-card";
          return (
            <button key={k} disabled={mostra} onClick={() => onPick(id, k)}
              className={`btn-ink justify-start gap-3 text-left font-mono ${cls} ${mostra ? "" : "hover:-translate-y-0.5"}`}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-current font-bold">{LETRAS[k]}</span>
              <span>{o}</span>
            </button>
          );
        })}
      </div>
      {!mostra ? (
        <button className="btn-ink mt-4 bg-primary text-primary-foreground" disabled={escolha === undefined} onClick={() => onResponder(id)}>
          Responder
        </button>
      ) : (
        <div className="mt-4 space-y-3 rounded-lg border-2 border-foreground bg-secondary p-4">
          <p><strong>Gabarito: {LETRAS[q.a]}.</strong> {q.why}</p>
          {respondida && (
            <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={() => onRefazer(id)}>
              Refazer questão
            </button>
          )}
        </div>
      )}
    </article>
  );
}

function Simulado({ pool, answers, picked, onPick, onResponder, onRefazer, onTimeout, onVoltar }: {
  pool: number[];
  answers: Record<number, number>;
  picked: Record<number, number>;
  onPick: (id: number, k: number) => void;
  onResponder: (id: number) => void;
  onRefazer: (id: number) => void;
  onTimeout: (id: number) => void;
  onVoltar: () => void;
}) {
  const [qtd, setQtd] = useState("10");
  const [ids, setIds] = useState<number[] | null>(null);
  const [finalizado, setFinalizado] = useState(false);
  const [duelo, setDuelo] = useState(false);
  const [seg, setSeg] = useState(30);
  const [bonus, setBonus] = useState<Record<number, number>>({});
  const [copiado, setCopiado] = useState(false);
  const prevIds = useRef<number[]>([]);

  const iniciar = () => {
    const n = qtd === "todas" ? pool.length : Math.min(Number(qtd), pool.length);
    if (n === 0) return;
    const arr = [...pool];
    for (let l = arr.length - 1; l > 0; l--) {
      const j = Math.floor(Math.random() * (l + 1));
      const tmp = arr[l]!;
      arr[l] = arr[j]!;
      arr[j] = tmp;
    }
    setIds(arr.slice(0, n));
    setFinalizado(false);
    setBonus({});
    setSeg(30);
    prevIds.current = [];
  };

  const sair = () => {
    setIds(null);
    setFinalizado(false);
    setBonus({});
    setSeg(30);
    prevIds.current = [];
  };

  useEffect(() => {
    if (!duelo || !ids || finalizado) return;
    const t = window.setInterval(() => setSeg((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [duelo, ids, finalizado]);

  useEffect(() => {
    if (!duelo || !ids) {
      prevIds.current = [];
      return;
    }
    const cur = ids.filter((id) => answers[id] !== undefined);
    const prev = prevIds.current;
    const novos = cur.filter((id) => !prev.includes(id));
    if (novos.length === 0 && cur.length === prev.length) return;
    setBonus((b) => {
      const n: Record<number, number> = {};
      for (const id of cur) {
        const keep = b[id];
        if (keep !== undefined) n[id] = keep;
        else n[id] = novos.includes(id) && seg >= 20 ? 0.2 : 0;
      }
      return n;
    });
    if (novos.length) setSeg(30);
    prevIds.current = cur;
  });

  useEffect(() => {
    if (!duelo || !ids || finalizado || seg > 0) return;
    const alvo = ids.find((id) => answers[id] === undefined);
    if (alvo === undefined) return;
    onTimeout(alvo);
    setSeg(30);
  });

  if (!ids) {
    return (
      <section className="card-ink space-y-4 p-6">
        <h2 className="text-2xl font-bold">Simulado</h2>
        <p className="text-muted-foreground">
          Sorteia questões misturadas respeitando conteúdo, dificuldade e busca ativos no banco.
          Responder aqui também conta no seu progresso.
        </p>
        <div className="grid items-end gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Quantidade</span>
            <select className="field-ink mt-1" value={qtd} onChange={(e) => setQtd(e.target.value)}>
              {["5", "10", "15", "20", "todas"].map((v) => (
                <option key={v} value={v}>{v === "todas" ? `Todas (${pool.length})` : `${v} questões`}</option>
              ))}
            </select>
          </label>
          <p className="font-mono text-sm text-muted-foreground">{pool.length} disponíveis no filtro atual</p>
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-md border-2 border-foreground bg-secondary px-3 py-2 text-sm">
          <input type="checkbox" checked={duelo} onChange={(e) => { setDuelo(e.target.checked); setSeg(30); }} className="h-4 w-4" />
          <span><strong>Duelo contra o relógio:</strong> 30s por questão, o tempo esgotado erra sozinho. Responder com 20s ou mais vale +0,2.</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ink bg-primary text-primary-foreground" disabled={pool.length === 0} onClick={iniciar}>
            Começar simulado
          </button>
          <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={onVoltar}>Voltar ao banco</button>
        </div>
      </section>
    );
  }

  const resp = ids.filter((id) => answers[id] !== undefined);
  const ok = resp.filter((id) => answers[id] === BANCO[id]!.a);
  const bonusSum = ids.reduce((t, id) => t + (bonus[id] ?? 0), 0);
  const nota = Math.min(10, (ok.length / ids.length) * 10 + (duelo ? bonusSum : 0));
  const fmtNota = (v: number) => v.toFixed(1).replace(".", ",");
  const msg = nota >= 9 ? "Excelente, nível de aprovação!" : nota >= 7 ? "Muito bem, continue assim." : nota >= 5 ? "Na média: revise os comentários." : "Reveja os módulos e tente de novo.";

  const compartilhar = async () => {
    const texto = `Tirei ${fmtNota(nota)} no simulado LógiCo: ${ok.length} acertos em ${ids.length} questões${duelo && bonusSum > 0 ? " (com bônus de velocidade)" : ""}.`;
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      window.prompt("Copie seu resultado:", texto);
      return;
    }
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-6">
      {finalizado ? (
        <section className="card-ink space-y-2 p-8 text-center">
          {nota >= 9 && <Confetes />}
          <p className="font-mono text-sm text-muted-foreground">NOTA DO SIMULADO</p>
          <p className="mt-2 font-mono text-6xl font-extrabold text-accent">{fmtNota(nota)}</p>
          <p className="mt-2 text-muted-foreground">
            {ok.length} acertos em {ids.length} questões
            {duelo && bonusSum > 0 && ` (inclui +${fmtNota(bonusSum)} de bônus de velocidade)`}
          </p>
          <p className="mt-2 text-lg font-semibold">{msg}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button className="btn-ink bg-primary text-primary-foreground" onClick={sair}>Novo simulado</button>
            <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={compartilhar}>
              {copiado ? "Resultado copiado" : "Compartilhar resultado"}
            </button>
            <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={onVoltar}>Voltar ao banco</button>
          </div>
        </section>
      ) : (
        <section className="card-ink flex flex-wrap items-center justify-between gap-3 p-4 font-mono text-sm">
          <span>{resp.length}/{ids.length} respondidas</span>
          {duelo && (
            <span className="inline-flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 rounded-md border-2 border-foreground px-2 py-0.5 ${seg >= 20 ? "bg-success text-primary-foreground" : "bg-destructive text-primary-foreground"}`}>
                <Timer size={14} /> 0:{String(seg).padStart(2, "0")}
              </span>
              {seg >= 20 && (
                <span className="inline-flex items-center gap-1 rounded-md border-2 border-foreground bg-accent px-2 py-0.5 text-accent-foreground">
                  <Zap size={14} /> +0,2
                </span>
              )}
            </span>
          )}
          <div className="flex gap-2">
            <button className="btn-ink bg-primary px-3 py-1 text-sm text-primary-foreground" onClick={() => {
              setFinalizado(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}>
              Finalizar simulado
            </button>
            <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={sair}>Cancelar</button>
          </div>
        </section>
      )}
      {ids.map((id, n) => (
        <QuestionCard key={id} id={id} n={n + 1} reveal={finalizado}
          marcada={answers[id]} escolha={picked[id]}
          onPick={onPick} onResponder={onResponder} onRefazer={onRefazer} />
      ))}
    </div>
  );
}

function Quiz() {
  const [busca, setBusca] = useState("");
  const [tema, setTema] = useState("todos");
  const [nivel, setNivel] = useState<"todos" | Nivel>("todos");
  const [status, setStatus] = useState<"todas" | "pendentes" | "respondidas">("todas");
  const [ordem, setOrdem] = useState<number[]>(() => BANCO.map((_, i) => i));
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [aba, setAba] = useState<"banco" | "simulado">("banco");

  useEffect(() => {
    const raw = localStorage.getItem("logico-banco");
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as Record<string, number>;
      const valid: Record<number, number> = {};
      for (const [k, v] of Object.entries(data)) {
        const id = Number(k);
        if (Number.isInteger(id) && id >= 0 && id < BANCO.length && BANCO[id] && Number.isInteger(v) && v >= 0 && v < BANCO[id]!.ops.length) {
          valid[id] = v;
        }
      }
      setAnswers(valid);
    } catch {
      localStorage.removeItem("logico-banco");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("logico-banco", JSON.stringify(answers));
  }, [answers]);

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return ordem.filter((id) => {
      const item = BANCO[id]!;
      if (tema !== "todos" && item.tema !== tema) return false;
      if (nivel !== "todos" && item.nivel !== nivel) return false;
      if (status === "pendentes" && answers[id] !== undefined) return false;
      if (status === "respondidas" && answers[id] === undefined) return false;
      if (q && !(item.q.toLowerCase().includes(q) || item.tema.toLowerCase().includes(q) || item.why.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [ordem, tema, nivel, status, busca, answers]);

  const resp = filtradas.filter((id) => answers[id] !== undefined);
  const acertos = resp.filter((id) => answers[id] === BANCO[id]!.a);
  const pct = resp.length ? Math.round((acertos.length / resp.length) * 100) : 0;

  const pool = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return ordem.filter((id) => {
      const item = BANCO[id]!;
      if (tema !== "todos" && item.tema !== tema) return false;
      if (nivel !== "todos" && item.nivel !== nivel) return false;
      if (q && !(item.q.toLowerCase().includes(q) || item.tema.toLowerCase().includes(q) || item.why.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [ordem, tema, nivel, busca]);

  const embaralhar = () => {
    const arr = BANCO.map((_, i) => i);
    for (let l = arr.length - 1; l > 0; l--) {
      const j = Math.floor(Math.random() * (l + 1));
      const tmp = arr[l]!;
      arr[l] = arr[j]!;
      arr[j] = tmp;
    }
    setOrdem(arr);
  };

  const limparFiltros = () => {
    setBusca("");
    setTema("todos");
    setNivel("todos");
    setStatus("todas");
  };

  const responder = (id: number) => {
    const escolha = picked[id];
    if (escolha === undefined || answers[id] !== undefined) return;
    setAnswers((v) => ({ ...v, [id]: escolha }));
    setPicked((v) => {
      const next = { ...v };
      delete next[id];
      return next;
    });
  };

  const refazer = (id: number) => {
    setAnswers((v) => {
      const next = { ...v };
      delete next[id];
      return next;
    });
  };

  const estourar = (id: number) => {
    setAnswers((v) => (v[id] === undefined ? { ...v, [id]: -1 } : v));
    setPicked((v) => {
      if (v[id] === undefined) return v;
      const next = { ...v };
      delete next[id];
      return next;
    });
  };

  const pick = (id: number, k: number) => {
    if (answers[id] !== undefined) return;
    setPicked((v) => ({ ...v, [id]: k }));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="font-mono text-sm font-semibold text-accent">Treine o que Você Aprendeu</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Banco de Questões</h1>
        <p className="mt-2 text-muted-foreground">
          Treine por conteúdo e dificuldade, com gabarito em cada questão.
        </p>
        <div className="mt-3 flex w-full flex-wrap gap-2 font-mono text-sm">
          <span className="rounded-md border-2 border-foreground bg-secondary px-2.5 py-1">{resp.length}/{filtradas.length} respondidas</span>
          <span className="rounded-md border-2 border-foreground bg-secondary px-2.5 py-1">{acertos.length} acertos</span>
          <span className="rounded-md border-2 border-foreground bg-secondary px-2.5 py-1">{pct}% de aproveitamento</span>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["banco", "simulado"] as const).map((m) => (
          <button key={m} onClick={() => setAba(m)} className={`btn-ink px-4 py-1.5 text-sm ${aba === m ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {m === "banco" ? "Banco de questões" : "Simulado"}
          </button>
        ))}
      </div>

      {aba === "banco" ? (
      <>
      <section className="card-ink space-y-4 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Buscar</span>
            <input className="field-ink mt-1" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Palavra no enunciado…" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Conteúdo</span>
            <select className="field-ink mt-1" value={tema} onChange={(e) => setTema(e.target.value)}>
              <option value="todos">Todos os conteúdos</option>
              {TEMAS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Dificuldade</span>
            <select className="field-ink mt-1" value={nivel} onChange={(e) => setNivel(e.target.value as "todos" | Nivel)}>
              <option value="todos">Todas</option>
              {NIVEIS.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Situação</span>
            <select className="field-ink mt-1" value={status} onChange={(e) => setStatus(e.target.value as "todas" | "pendentes" | "respondidas")}>
              <option value="todas">Todas</option>
              <option value="pendentes">Não respondidas</option>
              <option value="respondidas">Respondidas</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={embaralhar}>Embaralhar</button>
          <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={limparFiltros}>Limpar filtros</button>
          <button className="btn-ink bg-card px-3 py-1 text-sm" onClick={() => { setAnswers({}); setPicked({}); }}>Zerar progresso</button>
        </div>
      </section>

      {filtradas.length === 0 ? (
        <div className="card-ink p-8 text-center">
          <p className="text-lg font-semibold">Nenhuma questão com esses filtros.</p>
          <button className="btn-ink mt-4 bg-primary text-primary-foreground" onClick={limparFiltros}>Limpar filtros</button>
        </div>
      ) : (
        filtradas.map((id, n) => (
          <QuestionCard key={id} id={id} n={n + 1} reveal={false}
            marcada={answers[id]} escolha={picked[id]}
            onPick={pick} onResponder={responder} onRefazer={refazer} />
        ))
      )}
      </>
      ) : (
        <Simulado pool={pool} answers={answers} picked={picked}
          onPick={pick} onResponder={responder} onRefazer={refazer} onTimeout={estourar}
          onVoltar={() => setAba("banco")} />
      )}
    </div>
  );
}
