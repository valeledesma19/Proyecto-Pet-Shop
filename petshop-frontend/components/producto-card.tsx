import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgregarCarritoButton } from "@/components/agregar-carrito-button";
import { FavoritoButton } from "@/components/favorito-button";
import { formatearPrecio } from "@/lib/utils";
import { resolverUrlImagen } from "@/lib/utils";

export interface ProductoCardData {
  id: number;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  precioFinal: number;
  descuento: number;
  stock: number;
  calificacionPromedio: number;
  imagenPrincipal: string;
}

export function ProductoCard({ producto }: { producto: ProductoCardData }) {
  const sinStock = producto.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white">
      <div className="relative aspect-square bg-neutral-100">
        <Link href={`/productos/${producto.id}`} className="absolute inset-0 block">
          <Image
            src={resolverUrlImagen(producto.imagenPrincipal)}
            alt={producto.nombre}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 280px, 50vw"
          />
        </Link>
        {producto.descuento > 0 && (
          <Badge variant="accent" className="pointer-events-none absolute left-3 top-3">
            -{producto.descuento}%
          </Badge>
        )}
        {sinStock && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-semibold text-neutral-600">
            Sin stock
          </span>
        )}
        <FavoritoButton productoId={producto.id} />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>{producto.marca}</span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent-500 text-accent-500" />
            {producto.calificacionPromedio.toFixed(1)}
          </span>
        </div>

        <Link href={`/productos/${producto.id}`}>
          <h3 className="line-clamp-2 font-display text-sm font-semibold text-foreground hover:text-sage-700">
            {producto.nombre}
          </h3>
        </Link>

        <Badge variant="outline" className="w-fit">
          {producto.categoria}
        </Badge>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {producto.descuento > 0 && (
              <p className="text-xs text-neutral-400 line-through">
                {formatearPrecio(producto.precio)}
              </p>
            )}
            <p className="font-display text-lg font-bold text-foreground">
              {formatearPrecio(producto.precioFinal)}
            </p>
          </div>

          <AgregarCarritoButton productoId={producto.id} disabled={sinStock} />
        </div>
      </div>
    </div>
  );
}
