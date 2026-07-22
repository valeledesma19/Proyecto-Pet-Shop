import Image from "next/image";
import { Heart, Leaf, Users } from "lucide-react";

const valores = [
  {
    icono: Heart,
    titulo: "Amor real por los animales",
    descripcion: "Cada producto que vendemos lo elegimos pensando en el bienestar de tu mascota, no solo en la venta.",
  },
  {
    icono: Leaf,
    titulo: "Calidad antes que cantidad",
    descripcion: "Trabajamos con marcas que confiamos, con controles de calidad estrictos en cada categoría.",
  },
  {
    icono: Users,
    titulo: "Un equipo que entiende",
    descripcion: "Somos dueños de mascotas también. Sabemos lo que se siente buscar lo mejor para ellas.",
  },
];

export default function NosotrosPage() {
  return (
    <div>
      <section className="bg-beige py-16 lg:py-20">
        <div className="container-content grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sage-600">Sobre Huellitas</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground lg:text-4xl">
              Una tienda hecha por y para amantes de las mascotas
            </h1>
            <p className="mt-4 text-neutral-600">
              Huellitas nació de una idea simple: conseguir todo lo que tu mascota necesita, con buena
              información y sin vueltas, en un solo lugar. Desde alimento balanceado hasta juguetes y
              accesorios, elegimos cada producto pensando en su bienestar.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=900&auto=format&fit=crop"
              alt="Persona con su mascota"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-content">
          <h2 className="font-display text-2xl font-bold text-foreground">Lo que nos guía</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {valores.map(({ icono: Icono, titulo, descripcion }) => (
              <div key={titulo}>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sage-100 text-sage-700">
                  <Icono className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">{titulo}</h3>
                <p className="mt-1.5 text-sm text-neutral-600">{descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}