export type Customer = {
  id: number
  code: string
  firstName: string
  middleName?: string
  lastNameOne: string
  lastNameTwo?: string
  address: string
  apartment?: string
  countryId: number
  stateId: number
  cityId: number
  zipCode: string
  phone: string
  dob: Date
  ssn: string
  dlid: string
  imageUrl?: string
  percentage: number
  isActive: boolean
  notes?: string
};

export type Companias = {
    id: string;
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
