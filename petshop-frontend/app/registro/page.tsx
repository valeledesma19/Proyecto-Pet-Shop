"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store/auth-store";

const registroSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es obligatorio").max(80),
    apellido: z.string().min(1, "El apellido es obligatorio").max(80),
    email: z.string().min(1, "El email es obligatorio").email("Ingresá un email válido").max(120),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(100),
    confirmarPassword: z.string().min(1, "Confirmá tu contraseña"),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  });

type RegistroFormValues = z.infer<typeof registroSchema>;

export default function RegistroPage() {
  const router = useRouter();
  const registro = useAuthStore((state) => state.registro);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroFormValues>({ resolver: zodResolver(registroSchema) });

  async function onSubmit(values: RegistroFormValues) {
    setErrorServidor(null);
    setEnviando(true);
    try {
      const { confirmarPassword, ...payload } = values;
      await registro(payload);
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setErrorServidor(err?.message ?? "No se pudo completar el registro. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container-content flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-500 text-white">
            <PawPrint className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <h1 className="font-display text-2xl font-bold text-foreground">Creá tu cuenta</h1>
          <p className="text-sm text-neutral-600">Sumate a Huellitas y empezá a comprar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" autoComplete="given-name" aria-invalid={!!errors.nombre} {...register("nombre")} />
              {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                autoComplete="family-name"
                aria-invalid={!!errors.apellido}
                {...register("apellido")}
              />
              {errors.apellido && <p className="text-xs text-destructive">{errors.apellido.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmarPassword">Confirmar</Label>
              <Input
                id="confirmarPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.confirmarPassword}
                {...register("confirmarPassword")}
              />
              {errors.confirmarPassword && (
                <p className="text-xs text-destructive">{errors.confirmarPassword.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="telefono">Teléfono (opcional)</Label>
            <Input id="telefono" type="tel" autoComplete="tel" {...register("telefono")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="direccion">Dirección (opcional)</Label>
            <Input id="direccion" autoComplete="street-address" {...register("direccion")} />
          </div>

          {errorServidor && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorServidor}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-medium text-sage-700 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
