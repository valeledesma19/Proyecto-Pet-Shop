"use client";

import { useState } from "react";
import Image from "next/image";

export function GaleriaProducto({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [activa, setActiva] = useState(0);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={imagenes[activa]}
          alt={nombre}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 560px, 100vw"
        />
      </div>

      {imagenes.length > 1 && (
        <div className="mt-4 flex gap-3">
          {imagenes.map((imagen, i) => (
            <button
              key={imagen + i}
              type="button"
              onClick={() => setActiva(i)}
              aria-label={`Ver imagen ${i + 1} de ${nombre}`}
              aria-current={i === activa}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === activa ? "border-sage-500" : "border-transparent"
              }`}
            >
              <Image src={imagen} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
