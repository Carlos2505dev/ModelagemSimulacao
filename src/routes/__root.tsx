import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { reportAppError } from "../lib/error-reporting";
import { useTheme } from "../hooks/use-theme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="card-ink max-w-md p-8 text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-2 font-mono text-muted-foreground">página ∉ site</p>
        <Link to="/" className="btn-ink mt-6 bg-primary text-primary-foreground">Voltar ao início</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card-ink max-w-md p-8 text-center">
        <h1 className="text-xl font-semibold">Algo deu errado</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="btn-ink mt-6 bg-primary text-primary-foreground">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const NAV = [
  { to: "/conjuntos", label: "Conjuntos" },
  { to: "/logica", label: "Lógica" },
  { to: "/aplicacoes", label: "Aplicações" },
  { to: "/quiz", label: "Desafio" },
  { to: "/sobre", label: "Sobre" },
  // { to: "/documentacao", label: "Documentação" },
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <QueryClientProvider client={queryClient}>
      <header className="sticky top-0 z-20 border-b-2 border-foreground bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-2xl font-extrabold">
            <img src="/favicon.ico" alt="Ícone LógiCo" className="h-8 w-8 rounded-md object-contain" />
            <span>
              Lógi<span className="text-accent">Co</span> <span className="font-mono text-sm text-muted-foreground">{"{A∪B}"}</span>
            </span>
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-1">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="rounded-md px-3 py-1.5 text-sm font-semibold"
                inactiveProps={{ className: "text-foreground hover:bg-secondary hover:text-foreground active:text-foreground" }}
                activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground active:text-primary-foreground" }}>
                {n.label}
              </Link>
            ))}
            <button onClick={toggle} type="button"
              aria-label={dark ? "Mudar para o modo claro" : "Mudar para o modo escuro"}
              title={dark ? "Mudar para o modo claro" : "Mudar para o modo escuro"}
              className="rounded-md border-2 border-foreground p-1.5 text-foreground hover:bg-secondary hover:text-foreground">
              {dark ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10"><Outlet /></main>
      <footer className="border-t-2 border-foreground py-6 text-center text-sm text-muted-foreground">
        AV3 · Modelagem e Simulação Matemática · Prof. Marcelo Lopes
      </footer>
    </QueryClientProvider>
  );
}
