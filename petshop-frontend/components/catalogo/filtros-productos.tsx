"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Categoria, Marca } from "@/lib/types";

const tiposMascota = [
  { value: "PERRO", label: "Perros" },
  { value: "GATO", label: "Gatos" },
  { value: "AVE", label: "Aves" },
  { value: "PEZ", label: "Peces" },
  { value: "ROEDOR", label: "Roedores" },
  { value: "REPTIL", label: "Reptiles" },
  { value: "OTRO", label: "Otros" },
];

export function FiltrosProductos({ categorias, marcas }: { categorias: Categoria[]; marcas: Marca[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [buscar, setBuscar] = useState(searchParams.get("buscar") ?? "");
  const [precioMin, setPrecioMin] = useState(searchParams.get("precioMin") ?? "");
  const [precioMax, setPrecioMax] = useState(searchParams.get("precioMax") ?? "");

  function actualizarFiltro(clave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) {
      params.set(clave, valor);
    } else {
      params.delete(clave);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSubmitBusqueda(event: FormEvent) {
    event.preventDefault();
    actualizarFiltro("buscar", buscar);
  }

  function handleSubmitPrecio(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    precioMin ? params.set("precioMin", precioMin) : params.delete("precioMin");
    precioMax ? params.set("precioMax", precioMax) : params.delete("precioMax");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function limpiarFiltros() {
    setBuscar("");
    setPrecioMin("");
    setPrecioMax("");
    router.push(pathname);
  }

  const tipoActivo = searchParams.get("tipoMascota") ?? "";

  return (
    <aside className="h-fit space-y-7 rounded-xl border border-border p-5">
      <form onSubmit={handleSubmitBusqueda}>
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Buscar</label>
        <input
          type="text"
          value={buscar}
          onChange={(event) => setBuscar(event.target.value)}
          placeholder="Nombre del producto..."
          className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus-visible:border-sage-500"
        />
      </form>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Tipo de mascota</p>
        <div className="mt-2 space-y-1">
          <button
            type="button"
            onClick={() => actualizarFiltro("tipoMascota", "")}
            className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${
              !tipoActivo ? "bg-sage-100 font-medium text-sage-700" : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Todos
          </button>
          {tiposMascota.map((tipo) => (
            <button
              key={tipo.value}
              type="button"
              onClick={() => actualizarFiltro("tipoMascota", tipo.value)}
              className={`block w-full rounded-md px-2 py-1.5 text-left text-sm ${
                tipoActivo === tipo.value ? "bg-sage-100 font-medium text-sage-700" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {tipo.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Categoría</label>
        <select
          value={searchParams.get("categoriaId") ?? ""}
          onChange={(event) => actualizarFiltro("categoriaId", event.target.value)}
          className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-2 text-sm"
        >
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Marca</label>
        <select
          value={searchParams.get("marcaId") ?? ""}
          onChange={(event) => actualizarFiltro("marcaId", event.target.value)}
          className="mt-2 h-10 w-full rounded-md border border-neutral-300 px-2 text-sm"
        >
          <option value="">Todas</option>
          {marcas.map((marca) => (
            <option key={marca.id} value={marca.id}>
              {marca.nombre}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmitPrecio}>
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Precio</label>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Mín"
            value={precioMin}
            onChange={(event) => setPrecioMin(event.target.value)}
            className="h-10 w-full rounded-md border border-neutral-300 px-2 text-sm"
          />
          <span className="text-neutral-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Máx"
            value={precioMax}
            onChange={(event) => setPrecioMax(event.target.value)}
            className="h-10 w-full rounded-md border border-neutral-300 px-2 text-sm"
          />
        </div>
        <Button type="submit" variant="outline" size="sm" className="mt-3 w-full">
          Aplicar precio
        </Button>
      </form>

      <Button type="button" variant="ghost" size="sm" onClick={limpiarFiltros} className="w-full">
        Limpiar filtros
      </Button>
    </aside>
  );
}
