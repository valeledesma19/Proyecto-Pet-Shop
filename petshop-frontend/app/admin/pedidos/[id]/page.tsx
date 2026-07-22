"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { EstadoPedidoBadge } from "@/components/pedido/estado-pedido-badge";
import { api } from "@/lib/api";
import { formatearPrecio } from "@/lib/utils";
import type { EstadoPedido, Pedido } from "@/lib/types";

const ESTADOS: EstadoPedido[] = ["PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO", "CANCELADO"];

export default function AdminPedidoDetallePage() {
  const params = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [cargando, setCargando] = useState(true);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPedido>("PENDIENTE");
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);

  function cargar() {
    setCargando(true);
    api
      .get<Pedido>(`/admin/pedidos/${params.id}`)
      .then(({ data }) => {
        setPedido(data);
        setNuevoEstado(data.estado);
      })
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleActualizarEstado() {
    setGuardando(true);
    setExito(false);
    try {
      await api.put(`/admin/pedidos/${params.id}/estado`, { estado: nuevoEstado });
      setExito(true);
      cargar();
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return <div className="py-16 text-center text-neutral-500">Cargando pedido...</div>;
  }

  if (!pedido) {
    return <div className="py-16 text-center text-destructive">No se encontró el pedido.</div>;
  }

  return (
    <div>
      <Link href="/admin/pedidos" className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-sage-700">
        <ArrowLeft className="h-4 w-4" /> Pedidos
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
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                {detalle.producto.imagenPrincipal && (
                  <Image
                    src={detalle.producto.imagenPrincipal}
                    alt={detalle.producto.nombre}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <p className="font-display text-sm font-semibold text-foreground">{detalle.producto.nombre}</p>
                <p className="text-xs text-neutral-500">
                  {formatearPrecio(detalle.precioUnitario)} x {detalle.cantidad}
                </p>
              </div>
              <span className="font-display text-sm font-bold text-foreground">
                {formatearPrecio(detalle.subtotal)}
              </span>
            </li>
          ))}
        </ul>

        <aside className="h-fit space-y-6 rounded-xl border border-border p-6">
          <div>
            <h2 className="font-display text-sm font-semibold text-foreground">Resumen</h2>
            <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3">
              <span className="font-display font-semibold text-foreground">Total</span>
              <span className="font-display text-xl font-bold text-foreground">{formatearPrecio(pedido.total)}</span>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <h2 className="flex items-center gap-1.5 font-display text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-sage-600" /> Envío a
            </h2>
            <p className="mt-2 text-sm text-neutral-600">{pedido.direccionEnvio}</p>
          </div>

          <div className="border-t border-neutral-200 pt-4">
            <h2 className="font-display text-sm font-semibold text-foreground">Actualizar estado</h2>
            <div className="mt-2 space-y-2">
              <Select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value as EstadoPedido)}>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0) + estado.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
              <Button className="w-full" disabled={guardando} onClick={handleActualizarEstado}>
                {guardando ? "Guardando..." : "Guardar estado"}
              </Button>
              {exito && (
                <p className="flex items-center gap-1.5 text-sm text-sage-700">
                  <CheckCircle2 className="h-4 w-4" /> Estado actualizado
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}