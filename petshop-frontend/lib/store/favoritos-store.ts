"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type { Favorito } from "@/lib/types";

interface FavoritosState {
  favoritos: Favorito[] | null;
  cargando: boolean;
  cargarFavoritos: () => Promise<void>;
  esFavorito: (productoId: number) => boolean;
  toggleFavorito: (productoId: number) => Promise<void>;
  limpiar: () => void;
}

export const useFavoritosStore = create<FavoritosState>((set, get) => ({
  favoritos: null,
  cargando: false,

  cargarFavoritos: async () => {
    set({ cargando: true });
    try {
      const { data } = await api.get<Favorito[]>("/favoritos");
      set({ favoritos: data });
    } catch {
      set({ favoritos: null });
    } finally {
      set({ cargando: false });
    }
  },

  esFavorito: (productoId) => {
    return get().favoritos?.some((favorito) => favorito.producto.id === productoId) ?? false;
  },

  toggleFavorito: async (productoId) => {
    const yaEsFavorito = get().esFavorito(productoId);
    if (yaEsFavorito) {
      await api.delete(`/favoritos/${productoId}`);
      set((state) => ({
        favoritos: state.favoritos?.filter((favorito) => favorito.producto.id !== productoId) ?? null,
      }));
    } else {
      const { data } = await api.post<Favorito>(`/favoritos/${productoId}`);
      set((state) => ({ favoritos: [data, ...(state.favoritos ?? [])] }));
    }
  },

  limpiar: () => set({ favoritos: null }),
}));
