import { Hero } from "@/components/home/hero";
import { CategoriasDestacadas } from "@/components/home/categorias-destacadas";
import { ProductosDestacados } from "@/components/home/productos-destacados";
import { Marcas } from "@/components/home/marcas";
import { Beneficios } from "@/components/home/beneficios";
import { Opiniones } from "@/components/home/opiniones";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriasDestacadas />
      <ProductosDestacados />
      <Marcas />
      <Beneficios />
      <Opiniones />
      <Newsletter />
    </>
  );
}
