"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCarritoStore } from "@/lib/store/carrito-store";
import { useEstaAutenticado, useAuthHidratado } from "@/lib/store/auth-store";
import { formatearPrecio } from "@/lib/utils";
import { api } from "@/lib/api";
import { resolverUrlImagen } from "@/lib/utils";
const IMAGEN_PLACEHOLDER =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=200&auto=format&fit=crop";

export default function CarritoPage() {
  const { carrito, cargando, cargarCarrito, actualizarCantidad, eliminarItem } = useCarritoStore();
  const autenticado = useEstaAutenticado();
  const authHidratado = useAuthHidratado();

  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<number | null>(null);

  useEffect(() => {
    if (autenticado) cargarCarrito();
  }, [autenticado, cargarCarrito]);

  async function handleCambiarCantidad(itemId: number, cantidadActual: number, delta: number) {
    const nuevaCantidad = cantidadActual + delta;
    if (nuevaCantidad < 1) {
      await eliminarItem(itemId);
      return;
    }
    await actualizarCantidad(itemId, nuevaCantidad);
  }

  async function handleFinalizarCompra(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setProcesando(true);
    try {
      const { data } = await api.post("/pedidos", { direccionEnvio: direccion });
      setPedidoConfirmado(data.id);
      useCarritoStore.setState({ carrito: { ...carrito!, items: [], total: 0 } });
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo generar el pedido. Intentá nuevamente.");
    } finally {
      setProcesando(false);
    }
  }

  if (!authHidratado || (cargando && !carrito && autenticado)) {
    return (
      <div className="container-content py-24 text-center text-neutral-500">Cargando tu carrito...</div>
    );
  }

  if (!autenticado) {
    return (
      <EstadoVacio
        titulo="Iniciá sesión para ver tu carrito"
        descripcion="Necesitás una cuenta para agregar productos y finalizar tu compra."
        cta={{ href: "/login", label: "Iniciar sesión" }}
      />
    );
  }

  if (pedidoConfirmado) {
    return (
      <div className="container-content flex flex-col items-center gap-4 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-sage-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="font-display text-2xl font-bold text-foreground">¡Pedido confirmado!</h1>
        <p className="max-w-sm text-sm text-neutral-600">
          Tu pedido #{pedidoConfirmado} fue generado correctamente. Te avisaremos por correo cuando esté en camino.
        </p>
        <div className="mt-2 flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/pedidos/${pedidoConfirmado}`}>Ver mi pedido</Link>
          </Button>
          <Button asChild>
            <Link href="/productos">Seguir comprando</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!carrito || carrito.items.length === 0) {
    return (
      <EstadoVacio
        titulo="Tu carrito está vacío"
        descripcion="Todavía no agregaste productos. Explorá el catálogo y encontrá algo para tu mascota."
        cta={{ href: "/productos", label: "Ver productos" }}
      />
    );
  }

  return (
    <div className="container-content py-10">
      <h1 className="font-display text-3xl font-bold text-foreground">Tu carrito</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {carrito.items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                <Image
                  src={item.producto.imagenPrincipal ? resolverUrlImagen(item.producto.imagenPrincipal) : IMAGEN_PLACEHOLDER}
                  alt={item.producto.nombre}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/productos/${item.producto.id}`}
                    className="font-display text-sm font-semibold text-foreground hover:text-sage-700"
                  >
                    {item.producto.nombre}
                  </Link>
                  <p className="mt-1 text-xs text-neutral-500">{item.producto.marca.nombre}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Disminuir cantidad"
                      onClick={() => handleCambiarCantidad(item.id, item.cantidad, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                    <button
                      type="button"
                      aria-label="Aumentar cantidad"
                      onClick={() => handleCambiarCantidad(item.id, item.cantidad, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-display text-sm font-bold text-foreground">
                      {formatearPrecio(item.subtotal)}
                    </span>
                    <button
                      type="button"
                      aria-label="Eliminar producto"
                      onClick={() => eliminarItem(item.id)}
                      className="text-neutral-400 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-border p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Resumen</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
            <span>Subtotal</span>
            <span>{formatearPrecio(carrito.total)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-neutral-600">
            <span>Envío</span>
            <span>Se calcula al confirmar</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="font-display font-semibold text-foreground">Total</span>
            <span className="font-display text-xl font-bold text-foreground">{formatearPrecio(carrito.total)}</span>
          </div>

          {!mostrarCheckout ? (
            <Button size="lg" className="mt-6 w-full" onClick={() => setMostrarCheckout(true)}>
              <ShoppingBag />
              Finalizar compra
            </Button>
          ) : (
            <form onSubmit={handleFinalizarCompra} className="mt-6 space-y-3">
              <div>
                <label htmlFor="direccion" className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Dirección de envío
                </label>
                <input
                  id="direccion"
                  required
                  value={direccion}
                  onChange={(event) => setDireccion(event.target.value)}
                  placeholder="Calle, número, ciudad"
                  className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus-visible:border-sage-500"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={procesando}>
                {procesando ? "Procesando..." : "Confirmar pedido"}
              </Button>
            </form>
          )}
        </aside>
      </div>
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
        <ShoppingBag className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-bold text-foreground">{titulo}</h1>
      <p className="max-w-sm text-sm text-neutral-600">{descripcion}</p>
      <Button asChild className="mt-2">
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </div>
  );
}
