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

const loginSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Ingresá un email válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
      setErrorServidor(null);
      setEnviando(true);
      try {
        await login(values);
        const esAdmin = useAuthStore.getState().usuario?.roles.includes("ROLE_ADMIN");
        router.push(esAdmin ? "/admin" : "/");
        router.refresh();
    } catch (err: any) {
      setErrorServidor(err?.message ?? "No se pudo iniciar sesión. Intentá nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container-content flex min-h-[calc(100vh-5rem)] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-500 text-white">
            <PawPrint className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <h1 className="font-display text-2xl font-bold text-foreground">Iniciar sesión</h1>
          <p className="text-sm text-neutral-600">Ingresá a tu cuenta de Huellitas</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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

          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          {errorServidor && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorServidor}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={enviando}>
            {enviando ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="font-medium text-sage-700 hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
