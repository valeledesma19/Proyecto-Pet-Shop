"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCarritoStore } from "@/lib/store/carrito-store";
import { cn } from "@/lib/utils";

interface AgregarCarritoButtonProps {
  productoId: number;
  disabled?: boolean;
  variante?: "icono" | "grande";
}

export function AgregarCarritoButton({ productoId, disabled, variante = "icono" }: AgregarCarritoButtonProps) {
  const router = useRouter();
  const agregarProducto = useCarritoStore((state) => state.agregarProducto);
  const [estado, setEstado] = useState<"idle" | "cargando" | "agregado">("idle");

  async function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || estado === "cargando") return;

    setEstado("cargando");
    try {
      await agregarProducto(productoId, 1);
      setEstado("agregado");
      setTimeout(() => setEstado("idle"), 1500);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        router.push("/login");
        return;
      }
      setEstado("idle");
    }
  }

  if (variante === "grande") {
    return (
      <Button size="lg" disabled={disabled || estado === "cargando"} onClick={handleClick} className="min-w-56">
        {estado === "agregado" ? <Check /> : <ShoppingCart />}
        {estado === "agregado" ? "Agregado al carrito" : disabled ? "Sin stock" : "Agregar al carrito"}
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      aria-label="Agregar al carrito"
      disabled={disabled || estado === "cargando"}
      onClick={handleClick}
      className={cn(disabled && "opacity-50")}
    >
      {estado === "agregado" ? <Check /> : <ShoppingCart />}
    </Button>
  );
}
