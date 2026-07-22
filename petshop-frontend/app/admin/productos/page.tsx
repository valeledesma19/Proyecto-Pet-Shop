"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { formatearPrecio } from "@/lib/utils";
import type { PageResponse, Producto } from "@/lib/types";
import { resolverUrlImagen } from "@/lib/utils";
import { precioFinalDe } from "@/lib/utils";

const TAMANO_PAGINA = 10;

export default function AdminProductosPage() {
  const [resultado, setResultado] = useState<PageResponse<Producto> | null>(null);
  const [buscar, setBuscar] = useState("");
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  async function cargar() {
    setCargando(true);
    try {
      const { data } = await api.get<PageResponse<Producto>>("/admin/productos", {
        params: { buscar: buscar || undefined, page: pagina, size: TAMANO_PAGINA },
      });
      setResultado(data);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina]);

  function handleBuscarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPagina(0);
    cargar();
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Dar de baja este producto? Dejará de mostrarse en la tienda.")) return;
    setEliminandoId(id);
    try {
      await api.delete(`/admin/productos/${id}`);
      cargar();
    } finally {
      setEliminandoId(null);
    }
  }
  {!cargando &&
    resultado?.content.map((producto) => {
      console.log("PRODUCTO:", producto);

      return (
        <tr key={producto.id}>
          <td className="flex items-center gap-3 px-4 py-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
              {producto.imagenPrincipal && (
                <Image src={resolverUrlImagen(producto.imagenPrincipal)} alt={producto.nombre} fill className="object-cover" sizes="40px" />
              )}
            </div>
            <span className="font-medium text-foreground">
              {producto.nombre}
            </span>
          </td>

          <td className="px-4 py-3 text-neutral-600">
            {producto.categoria?.nombre}
          </td>

          <td className="px-4 py-3 text-neutral-600">
            {formatearPrecio(producto.precioFinal)}
          </td>

          <td className="px-4 py-3 text-neutral-600">
            {producto.stock}
          </td>

          <td className="px-4 py-3">
            <Badge variant={producto.activo ? "default" : "outline"}>
              {producto.activo ? "Activo" : "Inactivo"}
            </Badge>
          </td>

          <td className="px-4 py-3">
            <div className="flex justify-end gap-1.5">
              <Button variant="ghost" size="icon" aria-label="Editar" asChild>
                <Link href={`/admin/productos/${producto.id}`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Eliminar"
                disabled={eliminandoId === producto.id}
                onClick={() => handleEliminar(producto.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </td>
        </tr>
      );
    })}

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Productos</h1>
          <p className="mt-1 text-sm text-neutral-600">{resultado?.totalElements ?? "…"} productos</p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4" /> Nuevo producto
          </Link>
        </Button>
      </div>

      <form onSubmit={handleBuscarSubmit} className="mt-6 flex max-w-sm gap-2">
        <Input
          placeholder="Buscar por nombre..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        <Button type="submit" variant="outline" size="icon" aria-label="Buscar">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {cargando && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  Cargando...
                </td>
              </tr>
            )}
            {!cargando && resultado?.content.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
            {!cargando &&
              resultado?.content.map((producto) => (
                <tr key={producto.id}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                      {producto.imagenPrincipal && (
                        <Image src={resolverUrlImagen(producto.imagenPrincipal)} alt={producto.nombre} fill className="object-cover" sizes="40px" />
                      )}
                    </div>
                    <span className="font-medium text-foreground">{producto.nombre}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{producto.categoria?.nombre}</td>
                  <td className="px-4 py-3 text-neutral-600">{formatearPrecio(precioFinalDe(producto))}</td>
                  <td className="px-4 py-3 text-neutral-600">{producto.stock}</td>
                  <td className="px-4 py-3">
                    <Badge variant={producto.activo ? "default" : "outline"}>
                      {producto.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <Button variant="ghost" size="icon" aria-label="Editar" asChild>
                        <Link href={`/admin/productos/${producto.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Eliminar"
                        disabled={eliminandoId === producto.id}
                        onClick={() => handleEliminar(producto.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {resultado && resultado.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled={resultado.first}
            onClick={() => setPagina((p) => Math.max(p - 1, 0))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-neutral-600">
            Página {resultado.number + 1} de {resultado.totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Página siguiente"
            disabled={resultado.last}
            onClick={() => setPagina((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}