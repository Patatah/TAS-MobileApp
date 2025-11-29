export type Sucursal = {
   cadena: CadenaFarmaceutica;
   idSucursal: string;
   nombre: string;
   direccion: string;
   latitud: number;
   longitud: number;
   telefono?: string;
};

export enum EstadoPedido {
   Preparacion = "En preparación",
   Listo = "Listo para recoger",
   Cancelado = "Pedido cancelado",
   Entregado = "Entregado",
 };

export interface User {
   id: number;
   name: string;
   email: string;
   rol?: string;
   avatar?: string;
   email_verified_at: string | null;
   two_factor_enabled?: boolean;
   created_at: string;
   updated_at: string;
   [key: string]: unknown; // This allows for additional properties...
}

export type Pago = {
   monto: number;
};

export type CadenaFarmaceutica = {
   idCadena: string | null;
   nombre: string;
   vencimientoContrato?: string;
};

export type Receta = {
   sucursalRecogida: Sucursal;
   nombre?: string; 
   idReceta?: number;
   cedulaDoctor?: string;
   estado?: EstadoPedido;
   UsuarioCreador?: User;
   pago?: Pago;
   fechaLimiteRecogida?: string | Date;
   fechaCancelacion?: string | Date | null;
   lineas?: LineaReceta[];
};

export type DetalleEntrega = {
   cantidad: number,
   precioUnitario: number,
   sucursalOrigen?: Sucursal;
}

export type LineaReceta = {
   medicamento: Medicamento;
   cantidad: number;
   detalles?: DetalleEntrega[];
};

export type Medicamento = {
   idMedicamento: number | null;
   nombre: string;
   compuesto: string;
   presentacion: string;
   cantidadPorCaja: number;
   nomCantidad: string;
   esControlado: boolean;
};

