# Pet Shop - Backend

API REST para una tienda de mascotas, construida con Java 21, Spring Boot 3,
Spring Security + JWT, Spring Data JPA / Hibernate y PostgreSQL.

## Stack

- Java 21
- Spring Boot 3.3
- Spring Security + JWT (jjwt)
- Spring Data JPA / Hibernate
- MapStruct + Lombok
- PostgreSQL 16
- Swagger / OpenAPI (springdoc)
- Maven
- Docker / Docker Compose

## Estructura del proyecto

```
src/main/java/com/petshop/backend/
├── controller/       # Endpoints REST publicos y de usuario
│   └── admin/         # Endpoints REST del panel de administracion (ROLE_ADMIN)
├── service/           # Logica de negocio
├── repository/        # Interfaces Spring Data JPA
├── entity/            # Entidades JPA
├── dto/                # DTOs de entrada (Request) y salida (DTO)
├── mapper/            # Mappers MapStruct entidad <-> DTO
├── security/           # Configuracion de Spring Security, JWT, filtros
├── exception/          # Excepciones de dominio + GlobalExceptionHandler
├── config/             # Configuracion general (seed de roles, etc.)
└── utils/               # Utilidades varias (SecurityUtils, etc.)

database/               # Scripts SQL (schema, seed, reset)
```

## Levantar el proyecto con Docker Compose (recomendado)

Requisitos: Docker y Docker Compose instalados.

```bash
# 1. Copiar el archivo de variables de entorno de ejemplo
cp .env.example .env

# 2. (opcional) editar .env con tus propias credenciales/JWT_SECRET

# 3. Levantar Postgres + backend
docker compose up -d --build

# 4. Ver los logs
docker compose logs -f backend
```

La API queda disponible en `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`.

Al arrancar, `DataInitializer` crea automaticamente los roles `ROLE_USER`
y `ROLE_ADMIN`, y Hibernate crea el esquema de base de datos (gracias a
`JPA_DDL_AUTO=update`). Si queres datos de ejemplo (categorias, marcas,
productos y un usuario admin), corre el seed SQL:

```bash
docker exec -i petshop-db psql -U postgres -d petshop_db < database/seed.sql
```

Ver `database/README.md` para mas detalle sobre los scripts SQL.

### Apagar el stack

```bash
docker compose down          # detiene los contenedores, conserva los datos
docker compose down -v       # detiene los contenedores y borra los volumenes (datos)
```

## Levantar el proyecto localmente (sin Docker)

Requisitos: JDK 21, Maven, PostgreSQL 16 corriendo localmente.

```bash
# 1. Crear la base de datos
createdb petshop_db

# 2. Configurar variables de entorno (o editar application.yml directamente)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=petshop_db
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export JWT_SECRET=cambiaEstaClaveSecretaPorUnaMuyLargaYSeguraEnProduccion123456789

# 3. Compilar y correr
mvn spring-boot:run
```

Tambien podes abrir el proyecto directamente en **IntelliJ IDEA** (File →
Open → seleccionar la carpeta del backend) y correr `PetshopBackendApplication`
con las variables de entorno de arriba configuradas en la Run Configuration.

## Autenticacion

- `POST /api/auth/registro` — registro de usuarios (rol `ROLE_USER` por defecto)
- `POST /api/auth/login` — devuelve un JWT (`Authorization: Bearer <token>`)

Para operar como administrador, usa el usuario sembrado por `database/seed.sql`
(`admin@petshop.com` / `Admin123!`), o promove un usuario existente asignandole
`ROLE_ADMIN` en la tabla `usuario_roles`.

## Endpoints principales

| Modulo         | Base path              | Acceso                     |
|----------------|-------------------------|-----------------------------|
| Autenticacion  | `/api/auth`             | Publico                     |
| Productos      | `/api/productos`        | Publico (lectura)           |
| Categorias     | `/api/categorias`       | Publico (lectura)           |
| Marcas         | `/api/marcas`           | Publico (lectura)           |
| Valoraciones   | `/api/valoraciones`     | Publico (lectura) / Usuario |
| Carrito        | `/api/carrito`          | Usuario autenticado         |
| Favoritos      | `/api/favoritos`        | Usuario autenticado         |
| Pedidos        | `/api/pedidos`          | Usuario autenticado         |
| Administracion | `/api/admin/**`         | `ROLE_ADMIN`                |

Documentacion interactiva completa en Swagger UI una vez levantado el backend.

## Variables de entorno

Ver `.env.example` para la lista completa. Las mas importantes:

| Variable            | Descripcion                                  | Default                |
|---------------------|-----------------------------------------------|-------------------------|
| `DB_HOST`            | Host de PostgreSQL                            | `localhost`             |
| `DB_PORT`            | Puerto de PostgreSQL                          | `5432`                  |
| `DB_NAME`            | Nombre de la base de datos                    | `petshop_db`            |
| `DB_USERNAME`        | Usuario de PostgreSQL                         | `postgres`               |
| `DB_PASSWORD`        | Password de PostgreSQL                        | `postgres`               |
| `JWT_SECRET`         | Clave para firmar los JWT                     | (ver `.env.example`)     |
| `JWT_EXPIRATION_MS`  | Expiracion del token en milisegundos          | `86400000` (24h)         |
| `JPA_DDL_AUTO`       | Estrategia de Hibernate (`update`/`validate`) | `update`                  |

## Scripts SQL

Ver [`database/README.md`](database/README.md).
