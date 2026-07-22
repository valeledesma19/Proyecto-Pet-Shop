"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EstadoPedidoBadge } from "@/components/pedido/estado-pedido-badge";
import { useEstaAutenticado, useAuthHidratado } from "@/lib/store/auth-store";
import { api } from "@/lib/api";
import { formatearPrecio } from "@/lib/utils";
import type { Pedido, PageResponse } from "@/lib/types";

const TAMANO_PAGINA = 8;

export default function PedidosPage() {
  const autenticado = useEstaAutenticado();
  const authHidratado = useAuthHidratado();

  const [pagina, setPagina] = useState(0);
  const [resultado, setResultado] = useState<PageResponse<Pedido> | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autenticado) return;

    let cancelado = false;
    setCargando(true);
    setError(null);

    api
      .get<PageResponse<Pedido>>("/pedidos", {
        params: { page: pagina, size: TAMANO_PAGINA, sort: "fechaPedido,desc" },
      })
      .then(({ data }) => {
        if (!cancelado) setResultado(data);
      })
      .catch(() => {
        if (!cancelado) setError("No pudimos cargar tu historial de pedidos.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [autenticado, pagina]);

  if (!authHidratado || (cargando && !resultado && autenticado)) {
    return (
      <div className="container-content py-24 text-center text-neutral-500">Cargando tus pedidos...</div>
    );
  }

  if (!autenticado) {
    return (
      <EstadoVacio
        titulo="Iniciá sesión para ver tus pedidos"
        descripcion="Tu historial de compras aparece acá una vez que iniciás sesión."
        cta={{ href: "/login", label: "Iniciar sesión" }}
      />
    );
  }

  if (error) {
    return <div className="container-content py-24 text-center text-destructive">{error}</div>;
  }

  if (!resultado || resultado.content.length === 0) {
    return (
      <EstadoVacio
        titulo="Todavía no hiciste ningún pedido"
        descripcion="Cuando finalices una compra, la vas a ver reflejada acá."
        cta={{ href: "/productos", label: "Ver productos" }}
      />
    );
  }

  return (
    <div className="container-content py-10">
      <h1 className="font-display text-3xl font-bold text-foreground">Mis pedidos</h1>
      <p className="mt-1 text-sm text-neutral-600">{resultado.totalElements} pedidos en total</p>

      <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
        {resultado.content.map((pedido) => (
          <li key={pedido.id}>
            <Link
              href={`/pedidos/${pedido.id}`}
              className="flex flex-wrap items-center justify-between gap-3 py-5 hover:bg-neutral-50"
            >
              <div>
                <p className="font-display text-sm font-semibold text-foreground">Pedido #{pedido.id}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {new Date(pedido.fechaPedido).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {pedido.detalles.length} {pedido.detalles.length === 1 ? "producto" : "productos"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <EstadoPedidoBadge estado={pedido.estado} />
                <span className="font-display text-sm font-bold text-foreground">
                  {formatearPrecio(pedido.total)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {resultado.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled={resultado.first}
            onClick={() => setPagina((p) => Math.max(p - 1, 0))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-neutral-600">
            Página {resultado.number + 1} de {resultado.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Página siguiente"
            disabled={resultado.last}
            onClick={() => setPagina((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function EstadoVacio({
  titulo,
  descripcion,
  cta,
}: {
  titulo: string;
  descripcion: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="container-content flex flex-col items-center gap-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Package className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-bold text-foreground">{titulo}</h1>
      <p className="max-w-sm text-sm text-neutral-600">{descripcion}</p>
      <Button asChild className="mt-2">
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </div>
  );
}
