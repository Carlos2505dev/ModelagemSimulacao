import { useSyncExternalStore } from "react";

const KEY = "logico-favoritas";
let cache: string[] | null = null;
const ouvintes = new Set<() => void>();

function ler(): string[] {
  if (cache) return cache;
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(KEY);
    const dados: unknown = bruto ? JSON.parse(bruto) : [];
    cache = Array.isArray(dados) ? dados.filter((x): x is string => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function salvar(proximo: string[]) {
  cache = proximo;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(proximo));
  } catch {
    /* armazenamento indisponível */
  }
  ouvintes.forEach((ouvir) => ouvir());
}

function assinar(ouvir: () => void): () => void {
  ouvintes.add(ouvir);
  return () => {
    ouvintes.delete(ouvir);
  };
}

function foto(): string {
  return ler().join("");
}

/** Caderno de fórmulas favoritas, sincronizado entre todos os componentes. */
export function useFavoritas() {
  const chave = useSyncExternalStore(assinar, foto, () => "");
  const lista = chave ? chave.split("") : [];
  return {
    lista,
    tem: (f: string) => lista.includes(f),
    alternar: (f: string) => {
      const atual = ler();
      salvar(atual.includes(f) ? atual.filter((x) => x !== f) : [...atual, f]);
    },
    remover: (f: string) => {
      salvar(ler().filter((x) => x !== f));
    },
  };
}
