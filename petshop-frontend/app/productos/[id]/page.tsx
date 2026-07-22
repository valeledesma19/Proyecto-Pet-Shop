import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgregarCarritoButton } from "@/components/agregar-carrito-button";
import { FavoritoButton } from "@/components/favorito-button";
import { ProductoCard } from "@/components/producto-card";
import { GaleriaProducto } from "@/components/catalogo/galeria-producto";
import { obtenerProducto, obtenerProductos, obtenerValoraciones } from "@/lib/productos";
import { mapearProductoParaCard } from "@/lib/mappers";
import { formatearPrecio, precioFinalDe } from "@/lib/utils";

const IMAGEN_PLACEHOLDER =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop";

interface ProductoDetallePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetallePage({ params }: ProductoDetallePageProps) {
  const { id } = await params;
  const producto = await obtenerProducto(id);
  if (!producto) notFound();

  const [valoraciones, relacionadosPage] = await Promise.all([
    obtenerValoraciones(id),
    obtenerProductos({ categoriaId: String(producto.categoria.id), size: "5" }),
  ]);

  const relacionados = relacionadosPage.content.filter((p) => p.id !== producto.id).slice(0, 4);
  const imagenes = [producto.imagenPrincipal, ...(producto.imagenesSecundarias ?? [])].filter(
    (img): img is string => Boolean(img)
  );

  return (
    <div className="container-content py-10">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/productos" className="hover:text-sage-700">
          Productos
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{producto.nombre}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <GaleriaProducto
          imagenes={imagenes.length > 0 ? imagenes : [IMAGEN_PLACEHOLDER]}
          nombre={producto.nombre}
        />

        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>{producto.marca.nombre}</span>
            <span>·</span>
            <span>{producto.categoria.nombre}</span>
          </div>

          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{producto.nombre}</h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(producto.calificacionPromedio) ? "fill-accent-500 text-accent-500" : "text-neutral-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-neutral-500">
              {producto.calificacionPromedio.toFixed(1)} ({valoraciones.length} opiniones)
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            {producto.descuento > 0 && (
              <span className="text-lg text-neutral-400 line-through">{formatearPrecio(producto.precio)}</span>
            )}
            <span className="font-display text-4xl font-bold text-foreground">
              {formatearPrecio(precioFinalDe(producto))}
            </span>
            {producto.descuento > 0 && <Badge variant="accent">-{producto.descuento}%</Badge>}
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            {producto.stock > 0 ? `${producto.stock} unidades disponibles` : "Sin stock disponible"}
          </p>

          {producto.descripcion && (
            <p className="mt-6 leading-relaxed text-neutral-600">{producto.descripcion}</p>
          )}

          <div className="mt-8 flex items-center gap-3">
            <AgregarCarritoButton productoId={producto.id} disabled={producto.stock <= 0} variante="grande" />
            <FavoritoButton productoId={producto.id} variante="inline" />
          </div>

          <div className="mt-8 space-y-3 border-t border-neutral-200 pt-6">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Truck className="h-4 w-4 text-sage-600" />
              Envío gratis en compras desde $50.000
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <ShieldCheck className="h-4 w-4 text-sage-600" />
              Compra protegida
            </div>
          </div>
        </div>
      </div>

      {valoraciones.length > 0 && (
        <section className="mt-16 border-t border-neutral-200 pt-10">
          <h2 className="font-display text-2xl font-bold text-foreground">Opiniones de clientes</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {valoraciones.map((valoracion) => (
              <div key={valoracion.id} className="rounded-xl border border-border p-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < valoracion.puntuacion ? "fill-accent-500 text-accent-500" : "text-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                {valoracion.comentario && <p className="mt-2 text-sm text-neutral-600">{valoracion.comentario}</p>}
                <p className="mt-3 text-xs font-semibold text-foreground">{valoracion.usuarioNombre}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {relacionados.length > 0 && (
        <section className="mt-16 border-t border-neutral-200 pt-10">
          <h2 className="font-display text-2xl font-bold text-foreground">Productos relacionados</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {relacionados.map((relacionado) => (
              <ProductoCard key={relacionado.id} producto={mapearProductoParaCard(relacionado)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
