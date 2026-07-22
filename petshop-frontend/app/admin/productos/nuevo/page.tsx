import { ProductoForm } from "@/components/admin/producto-form";

export default function NuevoProductoPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold text-foreground">Nuevo producto</h1>
      <div className="mt-8">
        <ProductoForm />
      </div>
    </div>
  );
}