"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const datosContacto = [
  { icono: Mail, label: "Email", valor: "hola@huellitas.com" },
  { icono: Phone, label: "Teléfono", valor: "+54 351 000-0000" },
  { icono: MapPin, label: "Dirección", valor: "Villa María, Córdoba, Argentina" },
];

export default function ContactoPage() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviado(true);
  }

  return (
    <div className="container-content py-12">
      <div className="max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-sage-600">Hablemos</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground lg:text-4xl">Contacto</h1>
        <p className="mt-3 text-neutral-600">
          ¿Tenés una consulta sobre un pedido, un producto o algo más? Escribinos.
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {datosContacto.map(({ icono: Icono, label, valor }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-100 text-sage-700">
                <Icono className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
                <p className="mt-0.5 text-sm text-foreground">{valor}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          {enviado ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <h2 className="font-display text-lg font-semibold text-foreground">¡Gracias por escribirnos!</h2>
              <p className="text-sm text-neutral-600">Te vamos a responder a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="asunto">Asunto</Label>
                <Input id="asunto" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea id="mensaje" rows={5} required />
              </div>
              <Button type="submit" className="w-full">
                Enviar mensaje
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}