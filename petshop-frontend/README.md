# Huellitas — Frontend (Pet Shop)

Frontend de la tienda de mascotas construido con Next.js 15 (App Router), React 19,
TypeScript, Tailwind CSS y componentes propios estilo shadcn/ui.

## Requisitos

- Node.js 20+
- El backend (`petshop-backend`) corriendo en `http://localhost:8080`

## Instalación

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base de la API del backend | `http://localhost:8080/api` |

## Estructura

```
app/                  Rutas (App Router)
components/ui/         Primitivas reutilizables (Button, Badge, ...)
components/layout/      Navbar, Footer
components/home/        Secciones de la página principal
components/producto-card.tsx  Card de producto reutilizable en todo el sitio
lib/api.ts            Cliente Axios con interceptor de JWT
lib/types.ts           Tipos alineados con los DTOs del backend
lib/utils.ts            Helpers (cn, formatearPrecio)
```

## Notas

- Las imágenes de la Home (`Hero`, `CategoriasDestacadas`, `ProductosDestacados`) son
  placeholders de Unsplash. Reemplazalas por fotos propias antes de producción.
- Los productos de la sección "Destacados" son datos de ejemplo; se conectan a
  `GET /api/productos` en el paso del catálogo.
- Sin animaciones ni transiciones de scroll, por diseño.
