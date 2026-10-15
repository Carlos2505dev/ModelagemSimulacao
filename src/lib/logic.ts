export type Node =
  | { t: "var"; n: string }
  | { t: "not"; a: Node }
  | { t: "bin"; op: "and" | "or" | "imp" | "iff"; a: Node; b: Node };

const SYM: [RegExp, string][] = [
  [/<->|↔|<=>/y, "iff"],
  [/->|→|=>/y, "imp"],
  [/\^|∧|&/y, "and"],
  [/∨|\||v(?![a-z])/y, "or"],
  [/~|¬|!/y, "not"],
  [/\(/y, "("],
  [/\)/y, ")"],
  [/[a-uw-z]/y, "var"],
];

function tokenize(s: string) {
  const out: { k: string; v: string }[] = [];
  let i = 0;
  while (i < s.length) {
    if (/\s/.test(s[i]!)) { i++; continue; }
    let ok = false;
    for (const [re, k] of SYM) {
      re.lastIndex = i;
      const m = re.exec(s);
      if (m) { out.push({ k, v: m[0] }); i += m[0].length; ok = true; break; }
    }
    if (!ok) throw new Error(`Símbolo inválido: "${s[i]}"`);
  }
  return out;
}

export function parse(src: string): Node {
  const tk = tokenize(src.toLowerCase());
  let p = 0;
  const peek = () => tk[p]?.k as string | undefined;
  const prec: Record<string, number> = { iff: 1, imp: 2, or: 3, and: 4 };
  function unary(): Node {
    const k = peek();
    if (k === "not") { p++; return { t: "not", a: unary() }; }
    if (k === "(") { p++; const e = expr(0); if (peek() !== ")") throw new Error("Falta ')'"); p++; return e; }
    if (k === "var") return { t: "var", n: tk[p++]!.v };
    throw new Error("Expressão incompleta");
  }
  function expr(min: number): Node {
    let left = unary();
    for (;;) {
      const pk = peek();
      if (!pk) break;
      const pv = prec[pk];
      if (pv === undefined || pv < min) break;
      const op = pk as "and" | "or" | "imp" | "iff";
      const pr = pv;
      p++;
      const right = expr(op === "imp" ? pr : pr + 1);
      left = { t: "bin", op, a: left, b: right };
    }
    return left;
  }
  if (!tk.length) throw new Error("Digite uma proposição");
  const r = expr(0);
  if (p < tk.length) throw new Error(`Token inesperado: "${tk[p]!.v}"`);
  return r;
}

export function vars(n: Node, s = new Set<string>()): string[] {
  if (n.t === "var") s.add(n.n);
  else if (n.t === "not") vars(n.a, s);
  else { vars(n.a, s); vars(n.b, s); }
  return [...s].sort();
}

export function evaluate(n: Node, env: Record<string, boolean>): boolean {
  if (n.t === "var") return !!env[n.n];
  if (n.t === "not") return !evaluate(n.a, env);
  const a = evaluate(n.a, env), b = evaluate(n.b, env);
  switch (n.op) {
    case "and": return a && b;
    case "or": return a || b;
    case "imp": return !a || b;
    case "iff": return a === b;
  }
}

const OPS = { and: "∧", or: "∨", imp: "→", iff: "↔" };
export function show(n: Node, top = true): string {
  if (n.t === "var") return n.n;
  if (n.t === "not") return "¬" + show(n.a, false);
  const s = `${show(n.a, false)} ${OPS[n.op]} ${show(n.b, false)}`;
  return top ? s : `(${s})`;
}

export function subexprs(n: Node, acc: Node[] = []): Node[] {
  if (n.t === "not") subexprs(n.a, acc);
  if (n.t === "bin") { subexprs(n.a, acc); subexprs(n.b, acc); }
  if (n.t !== "var" && !acc.some((x) => show(x) === show(n))) acc.push(n);
  return acc;
}

export function rows(vs: string[]) {
  const total = 1 << vs.length;
  return Array.from({ length: total }, (_, i) =>
    Object.fromEntries(vs.map((v, j) => [v, !((i >> (vs.length - 1 - j)) & 1)])) as Record<string, boolean>,
  );
}

export function classify(n: Node): "Tautologia" | "Contradição" | "Contingência" {
  const r = rows(vars(n)).map((e) => evaluate(n, e));
  if (r.every(Boolean)) return "Tautologia";
  if (!r.some(Boolean)) return "Contradição";
  return "Contingência";
}

export function equivalent(a: Node, b: Node) {
  const vs = [...new Set([...vars(a), ...vars(b)])].sort();
  return rows(vs).every((e) => evaluate(a, e) === evaluate(b, e));
}
