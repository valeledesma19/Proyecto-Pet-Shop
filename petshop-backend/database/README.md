# Scripts SQL - Pet Shop

Este directorio contiene los scripts SQL para PostgreSQL, pensados como
alternativa manual al `ddl-auto=update` de Hibernate (por ejemplo, para
un despliegue de produccion donde se prefiere controlar el esquema a mano).

| Script       | Que hace                                                              |
|--------------|------------------------------------------------------------------------|
| `schema.sql` | Crea todas las tablas, claves foraneas, indices y restricciones.       |
| `seed.sql`   | Carga roles, un usuario admin, categorias, marcas y productos demo.    |
| `reset.sql`  | Elimina todas las tablas (solo para desarrollo).                       |

## Uso con Docker Compose

Con el stack levantado (`docker compose up -d`):

```bash
docker exec -i petshop-db psql -U postgres -d petshop_db < database/schema.sql
docker exec -i petshop-db psql -U postgres -d petshop_db < database/seed.sql
```

## Uso con PostgreSQL local

```bash
psql -h localhost -U postgres -d petshop_db -f database/schema.sql
psql -h localhost -U postgres -d petshop_db -f database/seed.sql
```

## Nota sobre `JPA_DDL_AUTO`

Por defecto, `application.yml` usa `JPA_DDL_AUTO=update`, por lo que
**Hibernate crea y actualiza las tablas automaticamente al arrancar** la
aplicacion (no hace falta correr `schema.sql` a mano en desarrollo).

Si preferis manejar el esquema con estos scripts en forma explicita
(recomendado para produccion), seteá `JPA_DDL_AUTO=validate` en el
`.env` antes de levantar el backend, y ejecuta `schema.sql` primero.

## Usuario administrador de prueba (`seed.sql`)

```
email:    admin@petshop.com
password: Admin123!
```

El hash de la contrasena se genera con la extension `pgcrypto` de
PostgreSQL usando el mismo algoritmo bcrypt que `BCryptPasswordEncoder`
de Spring Security, por lo que el login funciona sin pasos adicionales.
