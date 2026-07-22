import type { Producto } from "@/lib/types";
import type { ProductoCardData } from "@/components/producto-card";
import { precioFinalDe } from "@/lib/utils";
const IMAGEN_PLACEHOLDER =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=600&auto=format&fit=crop";

export function mapearProductoParaCard(producto: Producto): ProductoCardData {
  return {
    id: producto.id,
    nombre: producto.nombre,
    marca: producto.marca?.nombre ?? "",
    categoria: producto.categoria?.nombre ?? "",
    precio: producto.precio,
    precioFinal: precioFinalDe(producto),
    descuento: producto.descuento,
    stock: producto.stock,
    calificacionPromedio: producto.calificacionPromedio ?? 0,
    imagenPrincipal: producto.imagenPrincipal || IMAGEN_PLACEHOLDER,
  };
}
