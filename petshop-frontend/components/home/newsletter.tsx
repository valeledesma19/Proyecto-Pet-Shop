"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    // Aca se conectaria a un endpoint de newsletter real
    setEnviado(true);
    setEmail("");
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container-content">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-sage-500 px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Sumate a la comunidad Huellitas
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-sage-50">
              Recibí ofertas exclusivas, consejos de cuidado y novedades directo en tu correo.
            </p>
          </div>

          {enviado ? (
            <p className="font-medium text-white">¡Gracias por sumarte! Revisá tu correo pronto.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@email.com"
                aria-label="Correo electronico"
                className="h-12 flex-1 rounded-md border-0 bg-white px-4 text-sm text-foreground placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-white"
              />
              <Button type="submit" size="lg" className="bg-accent-500 hover:bg-accent-600">
                Suscribirme
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
