export type Clientes = {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  nacionalidad: string;
  imageUrl: string;
};

export type Companias = {
    id: number;
    name: string;
    direccion: string;
    telefono: string;
    comentarios: string;
    // cheques: Cheque[];
}

export type Cheque = {
  id: number;
  clienteId: number;
  companiaId: number;
  fechaActual: Date;
  fechaCheque: Date;
  cantidad: number;
  comision: number;
  subtotal: number;
  estado: string;
}
