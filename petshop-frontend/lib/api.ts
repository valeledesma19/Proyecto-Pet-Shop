import axios from "axios";
import { useAuthStore } from "@/lib/store/auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Nota: auth-store.ts importa `api` para llamar a /auth/login y /auth/registro,
// y este archivo importa `useAuthStore` para leer el token. Es un import circular
// seguro: ambos usos ocurren dentro de funciones (no al cargar el modulo), asi que
// para cuando se ejecutan, los dos modulos ya estan completamente inicializados.

// Adjunta el token JWT del store de autenticacion a cada request saliente
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token vencio o es invalido, cierra la sesion guardada localmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
