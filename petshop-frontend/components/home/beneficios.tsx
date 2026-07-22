import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const beneficios = [
  {
    icono: Truck,
    titulo: "Envío rápido",
    descripcion: "Recibí tu pedido en 24-48hs en las principales ciudades del país.",
  },
  {
    icono: ShieldCheck,
    titulo: "Compra segura",
    descripcion: "Pagos protegidos y datos encriptados en cada transacción.",
  },
  {
    icono: RotateCcw,
    titulo: "Cambios sencillos",
    descripcion: "30 días para cambiar o devolver tu producto sin vueltas.",
  },
  {
    icono: Headphones,
    titulo: "Asesoramiento real",
    descripcion: "Un equipo que ama a los animales, listo para ayudarte.",
  },
];

export function Beneficios() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-content grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {beneficios.map(({ icono: Icono, titulo, descripcion }) => (
          <div key={titulo} className="flex flex-col items-start gap-3 rounded-xl border border-border p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-700">
              <Icono className="h-5 w-5" />
            </span>
            <h3 className="font-display text-base font-semibold text-foreground">{titulo}</h3>
            <p className="text-sm text-neutral-600">{descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
