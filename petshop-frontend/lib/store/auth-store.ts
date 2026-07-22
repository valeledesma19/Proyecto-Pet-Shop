"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { api } from "@/lib/api";
import { useCarritoStore } from "@/lib/store/carrito-store";
import { useFavoritosStore } from "@/lib/store/favoritos-store";

/** Subconjunto de datos del usuario que devuelve el login/registro (JwtResponse del backend) */
export interface UsuarioAuth {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegistroPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
}

interface JwtResponse {
  token: string;
  tipo: string;
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
}

interface AuthState {
  usuario: UsuarioAuth | null;
  token: string | null;
  cargando: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  registro: (payload: RegistroPayload) => Promise<void>;
  logout: () => void;
    actualizarUsuario: (datos: Partial<UsuarioAuth>) => void;

}

// Storage "vacio" para cuando el store se evalua en el servidor (SSR/build),
// donde localStorage no existe. Evita que el modulo explote al importarse.
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function aUsuarioAuth(data: JwtResponse): UsuarioAuth {
  return { id: data.id, nombre: data.nombre, apellido: data.apellido, email: data.email, roles: data.roles };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      cargando: false,
      error: null,

      login: async ({ email, password }) => {
        set({ cargando: true, error: null });
        try {
          const { data } = await api.post<JwtResponse>("/auth/login", { email, password });
          set({ token: data.token, usuario: aUsuarioAuth(data) });
        } catch (err: any) {
          const mensaje = err?.response?.data?.message ?? "Email o contraseña incorrectos";
          set({ error: mensaje });
          throw new Error(mensaje);
        } finally {
          set({ cargando: false });
        }
      },

      registro: async (payload) => {
        set({ cargando: true, error: null });
        try {
          const { data } = await api.post<JwtResponse>("/auth/registro", payload);
          set({ token: data.token, usuario: aUsuarioAuth(data) });
        } catch (err: any) {
          const mensaje = err?.response?.data?.message ?? "No se pudo completar el registro";
          set({ error: mensaje });
          throw new Error(mensaje);
        } finally {
          set({ cargando: false });
        }
      },

      logout: () => {
        set({ usuario: null, token: null, error: null });

        // Al cerrar sesión, los datos del usuario anterior no deben seguir visibles
        useCarritoStore.setState({ carrito: null });
        useFavoritosStore.getState().limpiar();
      },

      actualizarUsuario: (datos) => {
        set((state) => ({
          usuario: state.usuario
            ? { ...state.usuario, ...datos }
            : state.usuario,
        }));
      },
  }),
    {
      name: "petshop-auth",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : noopStorage)),
      partialize: (state) => ({ usuario: state.usuario, token: state.token }),
      // El primer render (server y cliente) debe coincidir para evitar errores de
      // hidratacion de React. Por eso NO leemos localStorage automaticamente aca;
      // <AuthHydration> dispara la rehidratacion real en un useEffect, ya montado.
      skipHydration: true,
    }
  )
);

export function useEstaAutenticado(): boolean {
  return useAuthStore((state) => !!state.token);
}

export function useEsAdmin(): boolean {
  return useAuthStore((state) => !!state.usuario?.roles?.includes("ROLE_ADMIN"));
}

/**
 * Indica si ya se termino de leer la sesion guardada en localStorage
 * (ver skipHydration + <AuthHydration /> en components/providers).
 * Util para mostrar un estado de carga en vez de "no autenticado" por un
 * instante mientras se resuelve la sesion real.
 */
export function useAuthHidratado(): boolean {
  const [hidratado, setHidratado] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHidratado(true);
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => setHidratado(true));
    return () => unsub();
  }, []);

  return hidratado;
}
