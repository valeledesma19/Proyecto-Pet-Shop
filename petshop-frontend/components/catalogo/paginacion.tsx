import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FiltrosProductos } from "@/lib/productos";

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  filtros: FiltrosProductos;
}

function construirHref(filtros: FiltrosProductos, pagina: number) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor && clave !== "page") params.set(clave, valor);
  });
  params.set("page", String(pagina));
  return `/productos?${params.toString()}`;
}

/** Muestra como maximo 5 numeros de pagina, con elipsis si hay muchas */
function paginasVisibles(paginaActual: number, totalPaginas: number): (number | "...")[] {
  if (totalPaginas <= 5) {
    return Array.from({ length: totalPaginas }, (_, i) => i);
  }

  const paginas = new Set<number>([0, totalPaginas - 1, paginaActual]);
  if (paginaActual > 0) paginas.add(paginaActual - 1);
  if (paginaActual < totalPaginas - 1) paginas.add(paginaActual + 1);

  const ordenadas = Array.from(paginas).sort((a, b) => a - b);
  const resultado: (number | "...")[] = [];
  ordenadas.forEach((pagina, i) => {
    if (i > 0 && pagina - ordenadas[i - 1] > 1) resultado.push("...");
    resultado.push(pagina);
  });
  return resultado;
}

export function Paginacion({ paginaActual, totalPaginas, filtros }: PaginacionProps) {
  if (totalPaginas <= 1) return null;

  const esPrimera = paginaActual === 0;
  const esUltima = paginaActual === totalPaginas - 1;

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginación">
      <Link
        href={construirHref(filtros, Math.max(paginaActual - 1, 0))}
        aria-disabled={esPrimera}
        className={`flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 ${
          esPrimera ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {paginasVisibles(paginaActual, totalPaginas).map((pagina, i) =>
        pagina === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-neutral-400">
            …
          </span>
        ) : (
          <Link
            key={pagina}
            href={construirHref(filtros, pagina)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm ${
              pagina === paginaActual
                ? "border-sage-500 bg-sage-500 text-white"
                : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {pagina + 1}
          </Link>
        )
      )}

      <Link
        href={construirHref(filtros, Math.min(paginaActual + 1, totalPaginas - 1))}
        aria-disabled={esUltima}
        className={`flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 ${
          esUltima ? "pointer-events-none opacity-40" : "hover:bg-neutral-50"
        }`}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
