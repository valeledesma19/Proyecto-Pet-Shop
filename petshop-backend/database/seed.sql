-- ============================================================
-- Pet Shop - Seed SQL
-- ============================================================
-- Carga datos iniciales: roles, un usuario administrador,
-- categorias, marcas y productos de ejemplo.
-- Requiere haber ejecutado antes database/schema.sql.
--
-- Uso:
--   psql -h localhost -U postgres -d petshop_db -f database/seed.sql
--
-- Usuario admin creado:
--   email:    admin@petshop.com
--   password: Admin123!
-- (el hash se genera con pgcrypto usando el mismo algoritmo
--  bcrypt que usa Spring Security BCryptPasswordEncoder)
-- ============================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- Roles base
-- ------------------------------------------------------------
INSERT INTO roles (nombre)
VALUES ('ROLE_USER'), ('ROLE_ADMIN')
ON CONFLICT (nombre) DO NOTHING;

-- ------------------------------------------------------------
-- Usuario administrador
-- ------------------------------------------------------------
INSERT INTO usuarios (nombre, apellido, email, password, telefono, direccion, activo)
VALUES (
    'Admin',
    'PetShop',
    'admin@petshop.com',
    crypt('Admin123!', gen_salt('bf', 10)),
    '+54 351 000-0000',
    'Casa Central',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO usuario_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios u, roles r
WHERE u.email = 'admin@petshop.com' AND r.nombre = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

-- Cada usuario tiene su carrito propio (regla de negocio del backend)
INSERT INTO carritos (usuario_id)
SELECT u.id FROM usuarios u WHERE u.email = 'admin@petshop.com'
ON CONFLICT (usuario_id) DO NOTHING;

-- ------------------------------------------------------------
-- Categorias
-- ------------------------------------------------------------
INSERT INTO categorias (nombre, descripcion, imagen_url, activa) VALUES
    ('Alimento',    'Alimento balanceado y snacks para todo tipo de mascotas', '/img/categorias/alimento.jpg', TRUE),
    ('Juguetes',    'Juguetes para entretenimiento y estimulacion',            '/img/categorias/juguetes.jpg', TRUE),
    ('Higiene',     'Shampoos, cepillos y productos de limpieza',              '/img/categorias/higiene.jpg', TRUE),
    ('Accesorios',  'Collares, correas, camas y transportadoras',              '/img/categorias/accesorios.jpg', TRUE),
    ('Salud',       'Vitaminas, antiparasitarios y cuidado veterinario',       '/img/categorias/salud.jpg', TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- ------------------------------------------------------------
-- Marcas
-- ------------------------------------------------------------
INSERT INTO marcas (nombre, descripcion, logo_url, activa) VALUES
    ('Royal Canin', 'Nutricion especializada por raza y tamano', '/img/marcas/royal-canin.png', TRUE),
    ('Pedigree',    'Alimento balanceado para perros',           '/img/marcas/pedigree.png', TRUE),
    ('Whiskas',     'Alimento balanceado para gatos',            '/img/marcas/whiskas.png', TRUE),
    ('KONG',        'Juguetes resistentes para mascotas',        '/img/marcas/kong.png', TRUE),
    ('PetSafe',     'Accesorios y productos de seguridad',       '/img/marcas/petsafe.png', TRUE)
ON CONFLICT (nombre) DO NOTHING;

-- ------------------------------------------------------------
-- Productos de ejemplo
-- ------------------------------------------------------------
INSERT INTO productos (nombre, descripcion, precio, descuento, stock, imagen_principal, tipo_mascota, activo, categoria_id, marca_id)
SELECT
    v.nombre, v.descripcion, v.precio, v.descuento, v.stock, v.imagen_principal, v.tipo_mascota, TRUE,
    (SELECT id FROM categorias WHERE nombre = v.categoria),
    (SELECT id FROM marcas WHERE nombre = v.marca)
FROM (VALUES
    ('Royal Canin Adult 15kg', 'Alimento balanceado para perros adultos de razas medianas', 45000.00, 10, 30, '/img/productos/royal-canin-adult.jpg', 'PERRO', 'Alimento', 'Royal Canin'),
    ('Pedigree Cachorro 3kg',  'Alimento balanceado para cachorros en crecimiento',          12500.00, 0,  50, '/img/productos/pedigree-cachorro.jpg', 'PERRO', 'Alimento', 'Pedigree'),
    ('Whiskas Adulto 1.5kg',   'Alimento balanceado para gatos adultos, sabor salmon',        8900.00, 5,  40, '/img/productos/whiskas-adulto.jpg',    'GATO',  'Alimento', 'Whiskas'),
    ('KONG Classic Talla M',   'Juguete de goma resistente, ideal para rellenar con premios',  9500.00, 0,  60, '/img/productos/kong-classic.jpg',      'PERRO', 'Juguetes', 'KONG'),
    ('Correa PetSafe 1.5m',    'Correa reforzada con mango acolchado',                        11200.00, 15, 25, '/img/productos/petsafe-correa.jpg',    'PERRO', 'Accesorios', 'PetSafe'),
    ('Cama para gatos KONG',   'Cama suave y lavable para gatos y perros pequenos',           15800.00, 0,  20, '/img/productos/kong-cama.jpg',         'GATO',  'Accesorios', 'KONG'),
    ('Shampoo Royal Canin',    'Shampoo dermatologico para piel sensible',                     6800.00, 0,  35, '/img/productos/royal-canin-shampoo.jpg','OTRO',  'Higiene', 'Royal Canin'),
    ('Antipulgas PetSafe',     'Pipeta antiparasitaria mensual para perros medianos',          7400.00, 0,  45, '/img/productos/petsafe-antipulgas.jpg','PERRO', 'Salud', 'PetSafe')
) AS v(nombre, descripcion, precio, descuento, stock, imagen_principal, tipo_mascota, categoria, marca)
WHERE NOT EXISTS (SELECT 1 FROM productos p WHERE p.nombre = v.nombre);

COMMIT;
