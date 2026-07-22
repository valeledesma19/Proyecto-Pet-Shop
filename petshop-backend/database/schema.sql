-- ============================================================
-- Pet Shop - Schema SQL
-- ============================================================
-- Crea todas las tablas, claves foraneas y restricciones de
-- integridad del modelo relacional. Es un espejo del modelo
-- generado por las entidades JPA (usado cuando se despliega
-- con JPA_DDL_AUTO=validate o none en lugar de "update").
--
-- Uso:
--   psql -h localhost -U postgres -d petshop_db -f database/schema.sql
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- Usuarios y roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id              BIGSERIAL PRIMARY KEY,
    nombre          VARCHAR(80)  NOT NULL,
    apellido        VARCHAR(80)  NOT NULL,
    email           VARCHAR(120) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    telefono        VARCHAR(30),
    direccion       VARCHAR(200),
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    fecha_creacion  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    id      BIGSERIAL PRIMARY KEY,
    nombre  VARCHAR(20) NOT NULL UNIQUE
        CHECK (nombre IN ('ROLE_USER', 'ROLE_ADMIN'))
);

CREATE TABLE IF NOT EXISTS usuario_roles (
    usuario_id  BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_id      BIGINT NOT NULL REFERENCES roles(id)    ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, rol_id)
);

-- ------------------------------------------------------------
-- Catalogo: categorias, marcas y productos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id           BIGSERIAL PRIMARY KEY,
    nombre       VARCHAR(80)  NOT NULL UNIQUE,
    descripcion  VARCHAR(300),
    imagen_url   VARCHAR(500),
    activa       BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS marcas (
    id           BIGSERIAL PRIMARY KEY,
    nombre       VARCHAR(80)  NOT NULL UNIQUE,
    descripcion  VARCHAR(300),
    logo_url     VARCHAR(500),
    activa       BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS productos (
    id                      BIGSERIAL PRIMARY KEY,
    nombre                  VARCHAR(150)   NOT NULL,
    descripcion             TEXT,
    precio                  NUMERIC(12,2)  NOT NULL CHECK (precio > 0),
    descuento               INTEGER        NOT NULL DEFAULT 0 CHECK (descuento BETWEEN 0 AND 100),
    stock                   INTEGER        NOT NULL CHECK (stock >= 0),
    imagen_principal        VARCHAR(500),
    tipo_mascota            VARCHAR(20)
        CHECK (tipo_mascota IN ('PERRO','GATO','AVE','PEZ','ROEDOR','REPTIL','OTRO')),
    calificacion_promedio   DOUBLE PRECISION DEFAULT 0,
    cantidad_vendida        BIGINT         NOT NULL DEFAULT 0,
    activo                  BOOLEAN        NOT NULL DEFAULT TRUE,
    fecha_creacion          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    categoria_id            BIGINT         NOT NULL REFERENCES categorias(id),
    marca_id                BIGINT         NOT NULL REFERENCES marcas(id)
);

-- Coleccion de imagenes secundarias del producto (@ElementCollection)
CREATE TABLE IF NOT EXISTS producto_imagenes (
    producto_id  BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    url_imagen   VARCHAR(500)
);

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_marca      ON productos(marca_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo     ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_tipo        ON productos(tipo_mascota);

-- ------------------------------------------------------------
-- Carrito de compras
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS carritos (
    id                    BIGSERIAL PRIMARY KEY,
    usuario_id            BIGINT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_actualizacion   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carrito_items (
    id           BIGSERIAL PRIMARY KEY,
    carrito_id   BIGINT  NOT NULL REFERENCES carritos(id)  ON DELETE CASCADE,
    producto_id  BIGINT  NOT NULL REFERENCES productos(id),
    cantidad     INTEGER NOT NULL CHECK (cantidad > 0),
    UNIQUE (carrito_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_carrito_items_carrito ON carrito_items(carrito_id);

-- ------------------------------------------------------------
-- Pedidos y detalle de pedidos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
    id               BIGSERIAL PRIMARY KEY,
    usuario_id       BIGINT        NOT NULL REFERENCES usuarios(id),
    fecha_pedido     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado           VARCHAR(20)   NOT NULL DEFAULT 'PENDIENTE'
        CHECK (estado IN ('PENDIENTE','CONFIRMADO','ENVIADO','ENTREGADO','CANCELADO')),
    total            NUMERIC(12,2) NOT NULL CHECK (total >= 0),
    direccion_envio  VARCHAR(250)  NOT NULL
);

CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id                BIGSERIAL PRIMARY KEY,
    pedido_id         BIGINT        NOT NULL REFERENCES pedidos(id)  ON DELETE CASCADE,
    producto_id       BIGINT        NOT NULL REFERENCES productos(id),
    cantidad          INTEGER       NOT NULL CHECK (cantidad > 0),
    precio_unitario   NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal          NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX IF NOT EXISTS idx_pedidos_usuario           ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_detalle_pedidos_pedido     ON detalle_pedidos(pedido_id);
CREATE INDEX IF NOT EXISTS idx_detalle_pedidos_producto   ON detalle_pedidos(producto_id);

-- ------------------------------------------------------------
-- Favoritos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favoritos (
    id               BIGSERIAL PRIMARY KEY,
    usuario_id       BIGINT    NOT NULL REFERENCES usuarios(id)  ON DELETE CASCADE,
    producto_id      BIGINT    NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    fecha_agregado   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON favoritos(usuario_id);

-- ------------------------------------------------------------
-- Valoraciones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS valoraciones (
    id               BIGSERIAL PRIMARY KEY,
    usuario_id       BIGINT      NOT NULL REFERENCES usuarios(id)  ON DELETE CASCADE,
    producto_id      BIGINT      NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    puntuacion       INTEGER     NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario       VARCHAR(500),
    fecha_creacion   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_valoraciones_producto ON valoraciones(producto_id);

COMMIT;
