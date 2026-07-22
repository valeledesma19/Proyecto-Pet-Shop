import Image from "next/image";
import Link from "next/link";

const categorias = [
  { nombre: "Perros", slug: "perros", imagen: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?q=80&w=600&auto=format&fit=crop" },
  { nombre: "Gatos", slug: "gatos", imagen: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600&auto=format&fit=crop" },
  { nombre: "Aves", slug: "aves", imagen: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?q=80&w=600&auto=format&fit=crop" },
  { nombre: "Peces", slug: "peces", imagen: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?q=80&w=600&auto=format&fit=crop" },
];

export function CategoriasDestacadas() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-content">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sage-600">Explorá por mascota</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Categorías destacadas</h2>
          </div>
          <Link href="/categorias" className="hidden text-sm font-medium text-sage-700 hover:underline sm:block">
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categorias.map((categoria) => (
            <Link
              key={categoria.slug}
              href={`/productos?categoria=${categoria.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100"
            >
              <Image
                src={categoria.imagen}
                alt={categoria.nombre}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
              <span className="absolute bottom-4 left-4 font-display text-lg font-bold text-white">
                {categoria.nombre}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
