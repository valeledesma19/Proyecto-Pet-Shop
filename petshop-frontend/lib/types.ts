// Tipos alineados con los DTOs del backend (com.petshop.backend.dto.*)

export type TipoMascota = "PERRO" | "GATO" | "AVE" | "PEZ" | "ROEDOR" | "REPTIL" | "OTRO";

export type EstadoPedido = "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  activa: boolean;
}

export interface Marca {
  id: number;
  nombre: string;
  descripcion?: string;
  logoUrl?: string;
  activa: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  descuento: number;
  precioFinal: number;
  stock: number;
  imagenPrincipal?: string;
  imagenesSecundarias: string[];
  tipoMascota: TipoMascota;
  calificacionPromedio: number;
  cantidadVendida: number;
  activo: boolean;
  categoria: Categoria;
  marca: Marca;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
  fechaCreacion: string;
  roles: string[];
}

export interface CarritoItem {
  id: number;
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  id: number;
  items: CarritoItem[];
  total: number;
}

export interface DetallePedido {
  id: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  fechaPedido: string;
  estado: EstadoPedido;
  total: number;
  direccionEnvio: string;
  detalles: DetallePedido[];
}

export interface Valoracion {
  id: number;
  usuarioNombre: string;
  puntuacion: number;
  comentario?: string;
  fechaCreacion: string;
}

export interface Favorito {
  id: number;
  producto: Producto;
  fechaAgregado: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
