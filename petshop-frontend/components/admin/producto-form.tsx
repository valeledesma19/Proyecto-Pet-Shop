"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { api } from "@/lib/api";
import type { Categoria, Marca, Producto, TipoMascota } from "@/lib/types";
const TIPOS_MASCOTA: TipoMascota[] = ["PERRO", "GATO", "AVE", "PEZ", "ROEDOR", "REPTIL", "OTRO"];


// Los inputs numéricos se leen con valueAsNumber (no como texto) o vienen de un
// <select> (string), así que un valor invalido/vacío se normaliza a "undefined"
// antes de validar. Antes, un valor vacío/mal escrito terminaba convirtiéndose
// silenciosamente en 0 en vez de mostrar el error de "obligatorio".
function limpiarNumero(valor: unknown) {
  if (typeof valor === "number") return Number.isNaN(valor) ? undefined : valor;
  if (typeof valor === "string") return valor.trim() === "" ? undefined : Number(valor);
  return valor;
}

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  descripcion: z.string().optional().or(z.literal("")),
  precio: z.preprocess(
    limpiarNumero,
    z
      .number({
        invalid_type_error: "Ingresá un precio válido (solo números, sin puntos ni comas)",
        required_error: "El precio es obligatorio",
      })
      .positive("El precio debe ser mayor a 0")
  ),
  descuento: z.preprocess(
    limpiarNumero,
    z.number({ invalid_type_error: "Ingresá un descuento válido", required_error: "El descuento es obligatorio" }).min(0).max(100)
  ),
  stock: z.preprocess(
    limpiarNumero,
    z
      .number({ invalid_type_error: "Ingresá un stock válido", required_error: "El stock es obligatorio" })
      .int("El stock debe ser un número entero")
      .min(0, "El stock no puede ser negativo")
  ),
  tipoMascota: z.enum(["PERRO", "GATO", "AVE", "PEZ", "ROEDOR", "REPTIL", "OTRO"]),
  categoriaId: z.preprocess(
    limpiarNumero,
    z.number({ invalid_type_error: "Elegí una categoría", required_error: "Elegí una categoría" }).positive("Elegí una categoría")
  ),
  marcaId: z.preprocess(
    limpiarNumero,
    z.number({ invalid_type_error: "Elegí una marca", required_error: "Elegí una marca" }).positive("Elegí una marca")
  ),
  activo: z.boolean(),
});
type ProductoFormValues = z.infer<typeof productoSchema>;

interface ProductoFormProps {
  producto?: Producto;
}

export function ProductoForm({ producto }: ProductoFormProps) {
  const router = useRouter();
  const esEdicion = !!producto;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [imagenPrincipal, setImagenPrincipal] = useState(producto?.imagenPrincipal ?? "");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Categoria[]>("/categorias").then(({ data }) => setCategorias(data));
    api.get<Marca[]>("/marcas").then(({ data }) => setMarcas(data));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: producto
      ? {
          nombre: producto.nombre,
          descripcion: producto.descripcion ?? "",
          precio: producto.precio,
          descuento: producto.descuento,
          stock: producto.stock,
          tipoMascota: producto.tipoMascota,
          categoriaId: producto.categoria.id,
          marcaId: producto.marca.id,
          activo: producto.activo,
        }
      : { descuento: 0, activo: true, tipoMascota: "PERRO" },
  });

  async function onSubmit(values: ProductoFormValues) {
    setError(null);
    setEnviando(true);
    try {
      const payload = { ...values, imagenPrincipal, imagenesSecundarias: producto?.imagenesSecundarias ?? [] };
      if (esEdicion) {
        await api.put(`/admin/productos/${producto!.id}`, payload);
      } else {
        await api.post("/admin/productos", payload);
      }
      window.location.href = "/admin/productos";
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "No se pudo guardar el producto.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <ImageUploader value={imagenPrincipal} onChange={setImagenPrincipal} label="Imagen principal" />

      <div className="space-y-1.5">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" aria-invalid={!!errors.nombre} {...register("nombre")} />
        {errors.nombre && <p className="text-xs text-destructive">{errors.nombre.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" rows={4} {...register("descripcion")} />
      </div>

      <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  aria-invalid={!!errors.precio}
                  {...register("precio", { valueAsNumber: true })}
                />
                <p className="text-xs text-neutral-400">Solo números, sin puntos ni comas (ej: 45000)</p>
                {errors.precio && <p className="text-xs text-destructive">{errors.precio.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="descuento">Descuento %</Label>
                <Input
                  id="descuento"
                  type="number"
                  inputMode="numeric"
                  aria-invalid={!!errors.descuento}
                  {...register("descuento", { valueAsNumber: true })}
                />
                {errors.descuento && <p className="text-xs text-destructive">{errors.descuento.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  inputMode="numeric"
                  aria-invalid={!!errors.stock}
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
              </div>
            </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="categoriaId">Categoría</Label>
          <Select id="categoriaId" aria-invalid={!!errors.categoriaId} {...register("categoriaId")}>
            <option value="">Elegir...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
          {errors.categoriaId && <p className="text-xs text-destructive">{errors.categoriaId.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="marcaId">Marca</Label>
          <Select id="marcaId" aria-invalid={!!errors.marcaId} {...register("marcaId")}>
            <option value="">Elegir...</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </Select>
          {errors.marcaId && <p className="text-xs text-destructive">{errors.marcaId.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tipoMascota">Tipo de mascota</Label>
          <Select id="tipoMascota" {...register("tipoMascota")}>
            {TIPOS_MASCOTA.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" {...register("activo")} />
        Producto activo (visible en la tienda)
      </label>

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear producto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/productos")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}