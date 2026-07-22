import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-beige">
      {/* Forma organica de fondo: unico elemento decorativo, sutil y sin animacion */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 hidden h-[560px] w-[560px] rounded-full bg-sage-100 lg:block"
      />

      <div className="container-content relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full border border-sage-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sage-700">
            Envios a todo el pais
          </span>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Todo lo que tu mejor amigo necesita
          </h1>

          <p className="mt-5 max-w-md text-lg text-neutral-600">
            Alimento, accesorios y cuidado premium para perros, gatos y mucho más.
            Calidad elegida con cariño, entregada en la puerta de tu casa.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/productos">
                <ShoppingBag />
                Comprar ahora
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/productos">
                Ver productos
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-neutral-200 pt-6">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Truck className="h-4 w-4 text-sage-600" />
              Envio gratis desde $50.000
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <ShieldCheck className="h-4 w-4 text-sage-600" />
              Compra 100% segura
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1200&auto=format&fit=crop"
              alt="Perro y gato juntos, felices y bien cuidados"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-xl bg-white p-4 shadow-soft sm:flex">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-50 text-accent-600 font-display text-sm font-bold">
              4.9
            </span>
            <div className="text-xs text-neutral-600">
              <p className="font-semibold text-foreground">+12.000 clientes</p>
              <p>confían en nosotros</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
