"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuthStore, useEstaAutenticado, useAuthHidratado } from "@/lib/store/auth-store";
import type { Usuario } from "@/lib/types";

const perfilSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(80),
  apellido: z.string().min(1, "El apellido es obligatorio").max(80),
  telefono: z.string().max(30).optional().or(z.literal("")),
  direccion: z.string().max(200).optional().or(z.literal("")),
});
type PerfilFormValues = z.infer<typeof perfilSchema>;

const passwordSchema = z
  .object({
    passwordActual: z.string().min(1, "Ingresá tu contraseña actual"),
    passwordNueva: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmarPasswordNueva: z.string().min(1, "Confirmá la nueva contraseña"),
  })
  .refine((data) => data.passwordNueva === data.confirmarPasswordNueva, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPasswordNueva"],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PerfilPage() {
  const autenticado = useEstaAutenticado();
  const authHidratado = useAuthHidratado();
  const actualizarUsuario = useAuthStore((state) => state.actualizarUsuario);

  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!autenticado) return;
    api
      .get<Usuario>("/usuarios/me")
      .then(({ data }) => setPerfil(data))
      .finally(() => setCargando(false));
  }, [autenticado]);

  if (!authHidratado || (cargando && autenticado)) {
    return <div className="container-content py-24 text-center text-neutral-500">Cargando tu perfil...</div>;
  }

  if (!autenticado) {
    return (
      <div className="container-content flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">Iniciá sesión para ver tu perfil</h1>
        <Link href="/login" className="text-sm font-medium text-sage-700 hover:underline">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="container-content py-24 text-center text-destructive">
        No pudimos cargar tu perfil. Intentá recargar la página.
      </div>
    );
  }

  return (
    <div className="container-content max-w-2xl py-10">
      <h1 className="font-display text-3xl font-bold text-foreground">Mi perfil</h1>
      <p className="mt-1 text-sm text-neutral-600">{perfil.email}</p>

      <div className="mt-8 space-y-10">
        <FormularioDatosPersonales perfil={perfil} onActualizado={(p) => { setPerfil(p); actualizarUsuario({ nombre: p.nombre, apellido: p.apellido }); }} />
        <FormularioCambiarPassword />
      </div>
    </div>
  );
}

function FormularioDatosPersonales({
  perfil,
  onActualizado,
}: {
  perfil: Usuario;
  onActualizado: (perfil: Usuario) => void;
}) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      telefono: perfil.telefono ?? "",
      direccion: perfil.direccion ?? "",
    },
  });

  async function onSubmit(values: PerfilFormValues) {
    setError(null);
    setExito(false);
    setEnviando(true);
    try {
      const { data } = await api.put<Usuario>("/usuarios/me", values);
      onActualizado(data);
      setExito(true);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo actualizar tu perfil.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="rounded-xl border border-border p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <User className="h-5 w-5 text-sage-600" /> Datos personales
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" aria-invalid={!!errors.nombre} {...register("nombre")} />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="apellido">Apellido</Label>
            <Input id="apellido" aria-invalid={!!errors.apellido} {...register("apellido")} />
            {errors.apellido && <p className="text-xs text-destructive">{errors.apellido.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" type="tel" {...register("telefono")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" {...register("direccion")} />
        </div>

        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        {exito && (
          <p className="flex items-center gap-1.5 text-sm text-sage-700">
            <CheckCircle2 className="h-4 w-4" /> Perfil actualizado correctamente
          </p>
        )}

        <Button type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </section>
  );
}

function FormularioCambiarPassword() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  async function onSubmit(values: PasswordFormValues) {
    setError(null);
    setExito(false);
    setEnviando(true);
    try {
      await api.put("/usuarios/me/password", {
        passwordActual: values.passwordActual,
        passwordNueva: values.passwordNueva,
      });
      setExito(true);
      reset();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo cambiar la contraseña.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="rounded-xl border border-border p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <KeyRound className="h-5 w-5 text-sage-600" /> Cambiar contraseña
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="passwordActual">Contraseña actual</Label>
          <Input
            id="passwordActual"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.passwordActual}
            {...register("passwordActual")}
          />
          {errors.passwordActual && <p className="text-xs text-destructive">{errors.passwordActual.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="passwordNueva">Nueva contraseña</Label>
            <Input
              id="passwordNueva"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.passwordNueva}
              {...register("passwordNueva")}
            />
            {errors.passwordNueva && <p className="text-xs text-destructive">{errors.passwordNueva.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmarPasswordNueva">Confirmar</Label>
            <Input
              id="confirmarPasswordNueva"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmarPasswordNueva}
              {...register("confirmarPasswordNueva")}
            />
            {errors.confirmarPasswordNueva && (
              <p className="text-xs text-destructive">{errors.confirmarPasswordNueva.message}</p>
            )}
          </div>
        </div>

        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        {exito && (
          <p className="flex items-center gap-1.5 text-sm text-sage-700">
            <CheckCircle2 className="h-4 w-4" /> Contraseña actualizada correctamente
          </p>
        )}

        <Button type="submit" variant="outline" disabled={enviando}>
          {enviando ? "Actualizando..." : "Actualizar contraseña"}
        </Button>
      </form>
    </section>
  );
}