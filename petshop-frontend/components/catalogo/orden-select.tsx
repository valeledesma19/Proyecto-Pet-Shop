"use client";

import type { ChangeEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const opciones = [
  { value: "id,desc", label: "Más recientes" },
  { value: "precio,asc", label: "Precio: menor a mayor" },
  { value: "precio,desc", label: "Precio: mayor a menor" },
  { value: "nombre,asc", label: "Nombre: A-Z" },
  { value: "cantidadVendida,desc", label: "Más vendidos" },
];

export function OrdenSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", event.target.value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      defaultValue={searchParams.get("sort") ?? "id,desc"}
      onChange={handleChange}
      aria-label="Ordenar por"
      className="h-10 rounded-md border border-neutral-300 px-3 text-sm"
    >
      {opciones.map((opcion) => (
        <option key={opcion.value} value={opcion.value}>
          {opcion.label}
        </option>
      ))}
    </select>
  );
}
