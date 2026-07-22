import { Star } from "lucide-react";

const opiniones = [
  {
    nombre: "Marina L.",
    mascota: "dueña de Toby (Golden Retriever)",
    comentario:
      "El alimento llegó en perfecto estado y a tiempo. Toby lo ama y se le nota el pelo mucho más brillante.",
    puntuacion: 5,
  },
  {
    nombre: "Federico R.",
    mascota: "dueño de Mishu (gato siamés)",
    comentario:
      "Excelente atención cuando tuve una consulta sobre el arenero. Me ayudaron a elegir el correcto para Mishu.",
    puntuacion: 5,
  },
  {
    nombre: "Sol A.",
    mascota: "dueña de Kiwi (cotorra)",
    comentario:
      "Encontré accesorios para aves que no conseguía en ningún otro lado. Envío rápido y bien embalado.",
    puntuacion: 4,
  },
];

export function Opiniones() {
  return (
    <section className="bg-beige py-16 lg:py-20">
      <div className="container-content">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-sage-600">Lo que dicen de nosotros</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Opiniones de clientes</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {opiniones.map((opinion) => (
            <div key={opinion.nombre} className="rounded-xl bg-white p-6 shadow-card">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < opinion.puntuacion ? "fill-accent-500 text-accent-500" : "text-neutral-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">"{opinion.comentario}"</p>
              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="font-display text-sm font-semibold text-foreground">{opinion.nombre}</p>
                <p className="text-xs text-neutral-500">{opinion.mascota}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
