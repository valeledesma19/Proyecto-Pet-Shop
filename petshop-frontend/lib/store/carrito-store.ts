"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type { Carrito } from "@/lib/types";

interface CarritoState {
  carrito: Carrito | null;
  cargando: boolean;
  cargarCarrito: () => Promise<void>;
  agregarProducto: (productoId: number, cantidad: number) => Promise<void>;
  actualizarCantidad: (itemId: number, cantidad: number) => Promise<void>;
  eliminarItem: (itemId: number) => Promise<void>;
  vaciarCarrito: () => Promise<void>;
}

export const useCarritoStore = create<CarritoState>((set) => ({
  carrito: null,
  cargando: false,

  cargarCarrito: async () => {
    set({ cargando: true });
    try {
      const { data } = await api.get<Carrito>("/carrito");
      set({ carrito: data });
    } catch {
      set({ carrito: null });
    } finally {
      set({ cargando: false });
    }
  },

  agregarProducto: async (productoId, cantidad) => {
    const { data } = await api.post<Carrito>("/carrito/items", { productoId, cantidad });
    set({ carrito: data });
  },

  actualizarCantidad: async (itemId, cantidad) => {
    const { data } = await api.put<Carrito>(`/carrito/items/${itemId}`, { cantidad });
    set({ carrito: data });
  },

  eliminarItem: async (itemId) => {
    const { data } = await api.delete<Carrito>(`/carrito/items/${itemId}`);
    set({ carrito: data });
  },

  vaciarCarrito: async () => {
    await api.delete("/carrito");
    set((state) => ({ carrito: state.carrito ? { ...state.carrito, items: [], total: 0 } : null }));
  },
}));
