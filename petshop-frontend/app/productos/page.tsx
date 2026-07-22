import { obtenerProductos, obtenerCategorias, obtenerMarcas, normalizarSearchParams } from "@/lib/productos";
import { mapearProductoParaCard } from "@/lib/mappers";
import { ProductoCard } from "@/components/producto-card";
import { FiltrosProductos } from "@/components/catalogo/filtros-productos";
import { OrdenSelect } from "@/components/catalogo/orden-select";
import { Paginacion } from "@/components/catalogo/paginacion";

interface ProductosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const filtros = normalizarSearchParams(await searchParams);

  const [productos, categorias, marcas] = await Promise.all([
    obtenerProductos(filtros),
    obtenerCategorias(),
    obtenerMarcas(),
  ]);

  return (
    <div className="container-content py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Productos</h1>
        <p className="mt-1 text-sm text-neutral-600">{productos.totalElements} productos encontrados</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <FiltrosProductos categorias={categorias} marcas={marcas} />

        <div>
          <div className="mb-6 flex items-center justify-end">
            <OrdenSelect />
          </div>

          {productos.content.length === 0 ? (
            <p className="rounded-xl border border-dashed border-neutral-300 py-16 text-center text-neutral-500">
              No encontramos productos con esos filtros.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {productos.content.map((producto) => (
                <ProductoCard key={producto.id} producto={mapearProductoParaCard(producto)} />
              ))}
            </div>
          )}

          <Paginacion paginaActual={productos.number} totalPaginas={productos.totalPages} filtros={filtros} />
        </div>
      </div>
    </div>
  );
}
