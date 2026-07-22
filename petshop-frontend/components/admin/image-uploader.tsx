"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/api\/?$/, "");

function urlCompleta(url: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

export function ImageUploader({ value, onChange, label = "Imagen" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<{ url: string }>("/admin/archivos/imagenes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo subir la imagen");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</p>

      <div
        className={cn(
          "relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50",
          !value && "cursor-pointer hover:border-sage-400"
        )}
        onClick={() => !value && inputRef.current?.click()}
      >
        {subiendo ? (
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
        ) : value ? (
          <>
            <Image src={urlCompleta(value)} alt="Imagen cargada" fill className="object-cover" sizes="160px" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-card"
              aria-label="Quitar imagen"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-neutral-400">
            <Upload className="h-5 w-5" />
            <span className="text-xs">Subir imagen</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}