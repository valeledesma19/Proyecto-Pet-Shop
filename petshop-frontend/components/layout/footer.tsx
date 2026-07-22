import Link from "next/link";
import { PawPrint, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

const columnas = [
  {
    titulo: "Tienda",
    links: [
      { href: "/productos", label: "Todos los productos" },
      { href: "/categorias", label: "Categorias" },
      { href: "/productos?ofertas=true", label: "Ofertas" },
      { href: "/productos?masVendidos=true", label: "Mas vendidos" },
    ],
  },
  {
    titulo: "Ayuda",
    links: [
      { href: "/contacto", label: "Contacto" },
      { href: "/envios", label: "Envios y entregas" },
      { href: "/devoluciones", label: "Cambios y devoluciones" },
      { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
    ],
  },
  {
    titulo: "Empresa",
    links: [
      { href: "/nosotros", label: "Sobre nosotros" },
      { href: "/sucursales", label: "Nuestras sucursales" },
      { href: "/trabaja-con-nosotros", label: "Trabaja con nosotros" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-beige">
      <div className="container-content grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-500 text-white">
              <PawPrint className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="font-display text-xl font-bold text-foreground">Huellitas</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-neutral-600">
            Todo lo que tu mascota necesita, elegido con cuidado. Alimento, accesorios
            y mucho cariño en cada pedido.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-600 hover:text-sage-700">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-600 hover:text-sage-700">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-600 hover:text-sage-700">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        {columnas.map((columna) => (
          <div key={columna.titulo}>
            <h3 className="font-display text-sm font-semibold text-foreground">{columna.titulo}</h3>
            <ul className="mt-4 space-y-3">
              {columna.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-600 hover:text-sage-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
              Av. Siempre Viva 1234, Villa Maria, Cordoba
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-sage-600" />
              (0353) 400-1234
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-sage-600" />
              hola@huellitas.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-200">
        <div className="container-content flex flex-col items-center justify-between gap-3 py-5 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Huellitas. Todos los derechos reservados.</p>
          <div className="flex gap-5">
            <Link href="/terminos" className="hover:text-sage-700">Terminos y condiciones</Link>
            <Link href="/privacidad" className="hover:text-sage-700">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
