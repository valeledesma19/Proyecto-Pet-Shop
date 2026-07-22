import type { Categoria, Marca, PageResponse, Producto, Valoracion } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export type FiltrosProductos = Record<string, string | undefined>;

const CLAVES_FILTRO = [
  "categoriaId",
  "marcaId",
  "tipoMascota",
  "precioMin",
  "precioMax",
  "buscar",
  "sort",
  "page",
  "size",
];

export async function obtenerProductos(filtros: FiltrosProductos = {}): Promise<PageResponse<Producto>> {
  const params = new URLSearchParams();
  CLAVES_FILTRO.forEach((clave) => {
    if (filtros[clave]) params.set(clave, filtros[clave] as string);
  });
  if (!params.has("sort")) params.set("sort", "id,desc");
  if (!params.has("page")) params.set("page", "0");
  if (!params.has("size")) params.set("size", "12");

  const res = await fetch(`${API_URL}/productos?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar los productos");
  return res.json();
}

export async function obtenerProducto(id: string): Promise<Producto | null> {
  const res = await fetch(`${API_URL}/productos/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function obtenerCategorias(): Promise<Categoria[]> {
  const res = await fetch(`${API_URL}/categorias`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function obtenerMarcas(): Promise<Marca[]> {
  const res = await fetch(`${API_URL}/marcas`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function obtenerValoraciones(productoId: string): Promise<Valoracion[]> {
  const res = await fetch(`${API_URL}/valoraciones/producto/${productoId}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

/** Next.js 15 entrega searchParams como { [clave]: string | string[] | undefined } */
export function normalizarSearchParams(
  searchParams: { [key: string]: string | string[] | undefined }
): FiltrosProductos {
  const resultado: FiltrosProductos = {};
  Object.entries(searchParams).forEach(([clave, valor]) => {
    resultado[clave] = Array.isArray(valor) ? valor[0] : valor;
  });
  return resultado;
}
