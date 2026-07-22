"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductoCard } from "@/components/producto-card";
import { useFavoritosStore } from "@/lib/store/favoritos-store";
import { useEstaAutenticado, useAuthHidratado } from "@/lib/store/auth-store";
import { mapearProductoParaCard } from "@/lib/mappers";

export default function FavoritosPage() {
  const autenticado = useEstaAutenticado();
  const authHidratado = useAuthHidratado();
  const { favoritos, cargando, cargarFavoritos } = useFavoritosStore();

  useEffect(() => {
    if (autenticado) cargarFavoritos();
  }, [autenticado, cargarFavoritos]);

  if (!authHidratado || (cargando && !favoritos && autenticado)) {
    return (
      <div className="container-content py-24 text-center text-neutral-500">Cargando tus favoritos...</div>
    );
  }

  if (!autenticado) {
    return (
      <EstadoVacio
        titulo="Iniciá sesión para ver tus favoritos"
        descripcion="Guardá los productos que te gustan para encontrarlos rápido más adelante."
        cta={{ href: "/login", label: "Iniciar sesión" }}
      />
    );
  }

  if (!favoritos || favoritos.length === 0) {
    return (
      <EstadoVacio
        titulo="Todavía no tenés favoritos"
        descripcion="Tocá el corazón en cualquier producto para guardarlo acá."
        cta={{ href: "/productos", label: "Ver productos" }}
      />
    );
  }

  return (
    <div className="container-content py-10">
      <h1 className="font-display text-3xl font-bold text-foreground">Tus favoritos</h1>
      <p className="mt-1 text-sm text-neutral-600">{favoritos.length} productos guardados</p>

      <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {favoritos.map((favorito) => (
          <ProductoCard key={favorito.id} producto={mapearProductoParaCard(favorito.producto)} />
        ))}
      </div>
    </div>
  );
}

function EstadoVacio({
  titulo,
  descripcion,
  cta,
}: {
  titulo: string;
  descripcion: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="container-content flex flex-col items-center gap-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Heart className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-bold text-foreground">{titulo}</h1>
      <p className="max-w-sm text-sm text-neutral-600">{descripcion}</p>
      <Button asChild className="mt-2">
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </div>
  );
}
