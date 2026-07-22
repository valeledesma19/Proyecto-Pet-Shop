-- ============================================================
-- Pet Shop - Reset SQL
-- ============================================================
-- Elimina todas las tablas de la aplicacion. Util en entornos
-- de desarrollo para volver a empezar desde cero.
-- NO ejecutar en produccion.
--
-- Uso:
--   psql -h localhost -U postgres -d petshop_db -f database/reset.sql
-- ============================================================

BEGIN;

DROP TABLE IF EXISTS valoraciones      CASCADE;
DROP TABLE IF EXISTS favoritos         CASCADE;
DROP TABLE IF EXISTS detalle_pedidos   CASCADE;
DROP TABLE IF EXISTS pedidos           CASCADE;
DROP TABLE IF EXISTS carrito_items     CASCADE;
DROP TABLE IF EXISTS carritos          CASCADE;
DROP TABLE IF EXISTS producto_imagenes CASCADE;
DROP TABLE IF EXISTS productos         CASCADE;
DROP TABLE IF EXISTS marcas            CASCADE;
DROP TABLE IF EXISTS categorias        CASCADE;
DROP TABLE IF EXISTS usuario_roles     CASCADE;
DROP TABLE IF EXISTS roles             CASCADE;
DROP TABLE IF EXISTS usuarios          CASCADE;

COMMIT;
