import Link from "next/link";
import { ProductoCard, type ProductoCardData } from "@/components/producto-card";
import { Button } from "@/components/ui/button";

// Datos de ejemplo: se reemplazan por la respuesta real de GET /api/productos
// cuando se conecte el catalogo (proximo paso).
const productosDestacados: ProductoCardData[] = [
  {
    id: 1,
    nombre: "Alimento Premium para Perros Adultos 15kg",
    marca: "NutriCan",
    categoria: "Perros",
    precio: 45000,
    precioFinal: 38250,
    descuento: 15,
    stock: 24,
    calificacionPromedio: 4.8,
    imagenPrincipal: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    nombre: "Arena Sanitaria Aglomerante para Gatos 10L",
    marca: "GatoFeliz",
    categoria: "Gatos",
    precio: 12000,
    precioFinal: 12000,
    descuento: 0,
    stock: 40,
    calificacionPromedio: 4.6,
    imagenPrincipal: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    nombre: "Rascador Torre para Gatos con Casita",
    marca: "GatoFeliz",
    categoria: "Gatos",
    precio: 38000,
    precioFinal: 32300,
    descuento: 15,
    stock: 8,
    calificacionPromedio: 4.9,
    imagenPrincipal: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    nombre: "Correa Retráctil para Perros 5m",
    marca: "PetGear",
    categoria: "Perros",
    precio: 15500,
    precioFinal: 15500,
    descuento: 0,
    stock: 0,
    calificacionPromedio: 4.4,
    imagenPrincipal: "https://images.unsplash.com/photo-1601758064135-cec9a3b8bcd3?q=80&w=600&auto=format&fit=crop",
  },
];

export function ProductosDestacados() {
  return (
    <section className="bg-beige py-16 lg:py-20">
      <div className="container-content">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sage-600">Los favoritos de la casa</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Productos destacados</h2>
          </div>
          <Button variant="outline" asChild className="hidden sm:inline-flex">
            <Link href="/productos">Ver catálogo completo</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {productosDestacados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      </div>
    </section>
  );
}
