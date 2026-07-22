"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useCarritoStore } from "@/lib/store/carrito-store";
import { useFavoritosStore } from "@/lib/store/favoritos-store";

/**
 * El store de auth usa `skipHydration: true` para que el primer render del
 * cliente coincida con el del servidor (que no tiene localStorage) y React no
 * tire un error de hidratacion. Este componente no renderiza nada: solo dispara
 * la rehidratacion real apenas el componente se monta en el navegador, y si
 * habia una sesion guardada, carga el carrito y los favoritos de ese usuario.
 */
export function AuthHydration() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();

    const unsubFinishHydration = useAuthStore.persist.onFinishHydration((state) => {
      if (state.token) {
        useCarritoStore.getState().cargarCarrito();
        useFavoritosStore.getState().cargarFavoritos();
      }
    });

    return () => unsubFinishHydration();
  }, []);

  return null;
}
