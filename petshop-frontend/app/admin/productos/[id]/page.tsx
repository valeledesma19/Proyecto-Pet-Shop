"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductoForm } from "@/components/admin/producto-form";
import { api } from "@/lib/api";
import type { Producto } from "@/lib/types";

export default function EditarProductoPage() {
  const params = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get<Producto>(`/admin/productos/${params.id}`)
      .then(({ data }) => setProducto(data))
      .finally(() => setCargando(false));
  }, [params.id]);

  if (cargando) {
    return <div className="py-16 text-center text-neutral-500">Cargando producto...</div>;
  }

  if (!producto) {
    return <div className="py-16 text-center text-destructive">No se encontró el producto.</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-foreground">Editar producto</h1>
      <div className="mt-8">
        <ProductoForm producto={producto} />
      </div>
    </div>
  );
}