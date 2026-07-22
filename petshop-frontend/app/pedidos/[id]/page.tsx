"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { EstadoPedidoBadge } from "@/components/pedido/estado-pedido-badge";
import { useEstaAutenticado, useAuthHidratado } from "@/lib/store/auth-store";
import { api } from "@/lib/api";
import { formatearPrecio } from "@/lib/utils";
import type { Pedido } from "@/lib/types";

const IMAGEN_PLACEHOLDER =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=200&auto=format&fit=crop";

export default function PedidoDetallePage() {
  const params = useParams<{ id: string }>();
  const autenticado = useEstaAutenticado();
  const authHidratado = useAuthHidratado();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autenticado) return;

    let cancelado = false;
    setCargando(true);

    api
      .get<Pedido>(`/pedidos/${params.id}`)
      .then(({ data }) => {
        if (!cancelado) setPedido(data);
      })
      .catch(() => {
        if (!cancelado) setError("No pudimos encontrar ese pedido.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [autenticado, params.id]);

  if (!authHidratado || (cargando && autenticado)) {
    return (
      <div className="container-content py-24 text-center text-neutral-500">Cargando el pedido...</div>
    );
  }

  if (!autenticado) {
    return (
      <div className="container-content flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Iniciá sesión para ver este pedido</h1>
        <Link href="/login" className="text-sm font-medium text-sage-700 hover:underline">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="container-content flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">{error ?? "Pedido no encontrado"}</h1>
        <Link href="/pedidos" className="text-sm font-medium text-sage-700 hover:underline">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="container-content py-10">
      <Link href="/pedidos" className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-sage-700">
        <ArrowLeft className="h-4 w-4" /> Mis pedidos
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Pedido #{pedido.id}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {new Date(pedido.fechaPedido).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <EstadoPedidoBadge estado={pedido.estado} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {pedido.detalles.map((detalle) => (
            <li key={detalle.id} className="flex gap-4 py-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                <Image
                  src={resolverUrlImagen(detalle.producto.imagenPrincipal)}
                  alt={detalle.producto.nombre}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/productos/${detalle.producto.id}`}
                    className="font-display text-sm font-semibold text-foreground hover:text-sage-700"
                  >
                    {detalle.producto.nombre}
                  </Link>
                  <p className="mt-1 text-xs text-neutral-500">
                    {formatearPrecio(detalle.precioUnitario)} x {detalle.cantidad}
                  </p>
                </div>
                <span className="font-display text-sm font-bold text-foreground">
                  {formatearPrecio(detalle.subtotal)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit space-y-6 rounded-xl border border-border p-6">
          <div>
            <h2 className="font-display text-sm font-semibold text-foreground">Resumen</h2>
            <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3">
              <span className="font-display font-semibold text-foreground">Total</span>
              <span className="font-display text-xl font-bold text-foreground">
                {formatearPrecio(pedido.total)}
              </span>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <h2 className="flex items-center gap-1.5 font-display text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-sage-600" /> Envío a
            </h2>
            <p className="mt-2 text-sm text-neutral-600">{pedido.direccionEnvio}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
