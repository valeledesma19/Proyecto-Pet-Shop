import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);

}
export function precioFinalDe(producto: { precio: number; descuento?: number | null; precioFinal?: number | null }): number {
  if (producto.precioFinal !== null && producto.precioFinal !== undefined) {
    return producto.precioFinal;
  }
  const descuento = producto.descuento ?? 0;
  return Math.round(producto.precio * (100 - descuento)) / 100;
}
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/api\/?$/, "");

/**
 * Las imágenes subidas (productos, categorías, marcas) se guardan como rutas
 * relativas del backend (ej: "/uploads/productos/xxx.jpg"). Si se usan tal
 * cual en <Image src=...>, el navegador las busca en el propio frontend
 * (localhost:3000) en vez del backend (localhost:8080), y nunca cargan.
 * Esta función les antepone el origen del backend cuando hace falta.
 */
export function resolverUrlImagen(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url}`;
}
