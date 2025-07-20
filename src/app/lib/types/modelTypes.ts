export type Customer = {
  id: string
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

export type Company = {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
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
