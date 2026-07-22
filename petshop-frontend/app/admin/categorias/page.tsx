"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/admin/image-uploader";
import { api } from "@/lib/api";
import type { Categoria } from "@/lib/types";

interface FormState {
  id: number | null;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  activa: boolean;
}

const FORM_VACIO: FormState = { id: null, nombre: "", descripcion: "", imagenUrl: "", activa: true };

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [form, setForm] = useState<FormState>(FORM_VACIO);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    setCargando(true);
    try {
      const { data } = await api.get<Categoria[]>("/admin/categorias");
      setCategorias(data);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function abrirNueva() {
    setForm(FORM_VACIO);
    setError(null);
    setPanelAbierto(true);
  }

  function abrirEdicion(categoria: Categoria) {
    setForm({
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? "",
      imagenUrl: categoria.imagenUrl ?? "",
      activa: categoria.activa,
    });
    setError(null);
    setPanelAbierto(true);
  }

  async function handleGuardar() {
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        imagenUrl: form.imagenUrl,
        activa: form.activa,
      };
      if (form.id) {
        await api.put(`/admin/categorias/${form.id}`, payload);
      } else {
        await api.post("/admin/categorias", payload);
      }
      setPanelAbierto(false);
      cargar();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo guardar la categoría.");
    } finally {
      setEnviando(false);
    }
  }

  async function handleEliminar(id: number) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    await api.delete(`/admin/categorias/${id}`);
    cargar();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Categorías</h1>
          <p className="mt-1 text-sm text-neutral-600">{categorias.length} categorías</p>
        </div>
        <Button onClick={abrirNueva}>
          <Plus className="h-4 w-4" /> Nueva categoría
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {cargando && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-neutral-500">
                    Cargando...
                  </td>
                </tr>
              )}
              {!cargando &&
                categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td className="px-4 py-3 font-medium text-foreground">{categoria.nombre}</td>
                    <td className="px-4 py-3">
                      <Badge variant={categoria.activa ? "default" : "outline"}>
                        {categoria.activa ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => abrirEdicion(categoria)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Eliminar" onClick={() => handleEliminar(categoria.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {panelAbierto && (
          <div className="h-fit rounded-xl border border-border bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-foreground">
                {form.id ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button onClick={() => setPanelAbierto(false)} aria-label="Cerrar">
                <X className="h-4 w-4 text-neutral-400" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <ImageUploader value={form.imagenUrl} onChange={(url) => setForm((f) => ({ ...f, imagenUrl: url }))} />

              <Input
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              />
              <Textarea
                placeholder="Descripción"
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              />
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300"
                  checked={form.activa}
                  onChange={(e) => setForm((f) => ({ ...f, activa: e.target.checked }))}
                />
                Activa
              </label>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button className="w-full" disabled={enviando} onClick={handleGuardar}>
                {enviando ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}