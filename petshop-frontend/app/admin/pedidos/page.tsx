"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EstadoPedidoBadge } from "@/components/pedido/estado-pedido-badge";
import { api } from "@/lib/api";
import { formatearPrecio } from "@/lib/utils";
import type { PageResponse, Pedido } from "@/lib/types";

const TAMANO_PAGINA = 12;

export default function AdminPedidosPage() {
  const [resultado, setResultado] = useState<PageResponse<Pedido> | null>(null);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    api
      .get<PageResponse<Pedido>>("/admin/pedidos", { params: { page: pagina, size: TAMANO_PAGINA } })
      .then(({ data }) => setResultado(data))
      .finally(() => setCargando(false));
  }, [pagina]);

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Pedidos</h1>
        <p className="mt-1 text-sm text-neutral-600">{resultado?.totalElements ?? "…"} pedidos</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {cargando && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
                  Cargando...
                </td>
              </tr>
            )}
            {!cargando &&
              resultado?.content.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="px-4 py-3 font-medium text-foreground">#{pedido.id}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {new Date(pedido.fechaPedido).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{formatearPrecio(pedido.total)}</td>
                  <td className="px-4 py-3">
                    <EstadoPedidoBadge estado={pedido.estado} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/pedidos/${pedido.id}`}>Ver detalle</Link>
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {resultado && resultado.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
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