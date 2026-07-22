"use client";

import { type MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useFavoritosStore } from "@/lib/store/favoritos-store";
import { useEstaAutenticado } from "@/lib/store/auth-store";
import { cn } from "@/lib/utils";

interface FavoritoButtonProps {
  productoId: number;
  variante?: "flotante" | "inline";
}

export function FavoritoButton({ productoId, variante = "flotante" }: FavoritoButtonProps) {
  const router = useRouter();
  const autenticado = useEstaAutenticado();
  const esFavorito = useFavoritosStore((state) => state.esFavorito(productoId));
  const toggleFavorito = useFavoritosStore((state) => state.toggleFavorito);
  const [enviando, setEnviando] = useState(false);

  async function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (enviando) return;

    if (!autenticado) {
      router.push("/login");
      return;
    }

    setEnviando(true);
    try {
      await toggleFavorito(productoId);
    } catch {
      // Silencioso: si falla, el corazon simplemente no cambia de estado
    } finally {
      setEnviando(false);
    }
  }

  const clases =
    variante === "flotante"
      ? "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card"
      : "flex h-11 w-11 items-center justify-center rounded-md border border-neutral-300 bg-white";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={enviando}
      aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={esFavorito}
      className={cn(clases, "text-neutral-500 hover:text-accent-500 disabled:opacity-60")}
    >
      <Heart className={cn("h-4 w-4", esFavorito && "fill-accent-500 text-accent-500")} />
    </button>
  );
}
