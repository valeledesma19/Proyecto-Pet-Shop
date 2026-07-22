"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavbarSearch() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (abierto) inputRef.current?.focus();
  }, [abierto]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const texto = query.trim();
    if (!texto) return;
    router.push(`/productos?buscar=${encodeURIComponent(texto)}`);
    setAbierto(false);
    setQuery("");
  }

  if (abierto) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => !query && setAbierto(false)}
          placeholder="Buscar productos..."
          className="h-9 w-40 rounded-md border border-neutral-300 px-3 text-sm outline-none focus-visible:border-sage-500 sm:w-56"
        />
        <Button type="button" variant="ghost" size="icon" aria-label="Cerrar búsqueda" onClick={() => setAbierto(false)}>
          <X className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Buscar" className="hidden sm:inline-flex" onClick={() => setAbierto(true)}>
      <Search />
    </Button>
  );
}