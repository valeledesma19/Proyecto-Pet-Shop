"use client";

import { useEffect, useState } from "react";
import { Package, ClipboardList, Users, Tags } from "lucide-react";
import { api } from "@/lib/api";
import type { PageResponse } from "@/lib/types";

interface Estadisticas {
  productos: number;
  pedidos: number;
  usuarios: number;
  categorias: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Estadisticas | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<PageResponse<unknown>>("/admin/productos", { params: { page: 0, size: 1 } }),
      api.get<PageResponse<unknown>>("/admin/pedidos", { params: { page: 0, size: 1 } }),
      api.get<PageResponse<unknown>>("/admin/usuarios", { params: { page: 0, size: 1 } }),
      api.get<unknown[]>("/categorias"),
    ]).then(([productos, pedidos, usuarios, categorias]) => {
      setStats({
        productos: productos.data.totalElements,
        pedidos: pedidos.data.totalElements,
        usuarios: usuarios.data.totalElements,
        categorias: categorias.data.length,
      });
    });
  }, []);

  const tarjetas = [
    { label: "Productos", valor: stats?.productos, icon: Package },
    { label: "Pedidos", valor: stats?.pedidos, icon: ClipboardList },
    { label: "Usuarios", valor: stats?.usuarios, icon: Users },
    { label: "Categorías", valor: stats?.categorias, icon: Tags },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-600">Resumen general de la tienda</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tarjetas.map(({ label, valor, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center gap-2 text-neutral-500">
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-foreground">
              {valor === undefined ? "…" : valor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}