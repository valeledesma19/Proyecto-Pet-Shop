"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCarritoStore } from "@/lib/store/carrito-store";
import { useEstaAutenticado } from "@/lib/store/auth-store";

export function CarritoBadge() {
  const carrito = useCarritoStore((state) => state.carrito);
  const cargarCarrito = useCarritoStore((state) => state.cargarCarrito);
  const autenticado = useEstaAutenticado();

  useEffect(() => {
    // AuthHydration ya dispara la primera carga apenas se resuelve la sesion
    // guardada; este efecto cubre el caso de login/logout durante la sesion.
    if (autenticado) cargarCarrito();
  }, [autenticado, cargarCarrito]);

  const cantidad = carrito?.items.reduce((acumulado, item) => acumulado + item.cantidad, 0) ?? 0;

  return (
    <Button variant="ghost" size="icon" aria-label="Carrito" asChild className="relative">
      <Link href="/carrito">
        <ShoppingCart />
        {cantidad > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
            {cantidad}
          </span>
        )}
      </Link>
    </Button>
  );
}
