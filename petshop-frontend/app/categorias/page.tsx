import Image from "next/image";
import Link from "next/link";
import { obtenerCategorias } from "@/lib/productos";
import {resolverUrlImagen } from "@/lib/utils";

const IMAGEN_PLACEHOLDER =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=600&auto=format&fit=crop";

export default async function CategoriasPage() {
  const categorias = await obtenerCategorias();
  const activas = categorias.filter((c) => c.activa);

  return (
    <div className="container-content py-12">
      <div className="max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-sage-600">Explorá la tienda</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground lg:text-4xl">Categorías</h1>
        <p className="mt-3 text-neutral-600">
          Encontrá todo lo que tu mascota necesita, organizado por categoría.
        </p>
      </div>

      {activas.length === 0 ? (
        <p className="mt-10 text-neutral-500">Todavía no hay categorías cargadas.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {activas.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/productos?categoriaId=${categoria.id}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100"
            >
              <Image
                src={categoria.imagenUrl ? resolverUrlImagen(categoria.imagenUrl) : IMAGEN_PLACEHOLDER}
                alt={categoria.nombre}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
              <span className="absolute bottom-4 left-4 font-display text-lg font-bold text-white">
                {categoria.nombre}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}