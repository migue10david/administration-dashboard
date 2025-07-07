import { Companias } from "@/app/lib/types/modelTypes"

export interface Cliente {
  id: number
  nombre: string
  email: string
  telefono: string
  empresa: string
  fechaRegistro: string
  estado: "Activo" | "Inactivo"
}

export const clientesMock: Cliente[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+51 999 123 456",
    empresa: "Tech Solutions SAC",
    fechaRegistro: "2024-01-15",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria.garcia@email.com",
    telefono: "+51 999 234 567",
    empresa: "Innovate Corp",
    fechaRegistro: "2024-02-20",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    telefono: "+51 999 345 678",
    empresa: "Digital Marketing Pro",
    fechaRegistro: "2024-01-30",
    estado: "Inactivo",
  },
  {
    id: 4,
    nombre: "Ana López",
    email: "ana.lopez@email.com",
    telefono: "+51 999 456 789",
    empresa: "Consulting Group",
    fechaRegistro: "2024-03-10",
    estado: "Activo",
  },
  {
    id: 5,
    nombre: "Pedro Martínez",
    email: "pedro.martinez@email.com",
    telefono: "+51 999 567 890",
    empresa: "Finance Solutions",
    fechaRegistro: "2024-02-05",
    estado: "Activo",
  },
  {
    id: 6,
    nombre: "Laura Sánchez",
    email: "laura.sanchez@email.com",
    telefono: "+51 999 678 901",
    empresa: "Creative Agency",
    fechaRegistro: "2024-01-25",
    estado: "Activo",
  },
  {
    id: 7,
    nombre: "Roberto Silva",
    email: "roberto.silva@email.com",
    telefono: "+51 999 789 012",
    empresa: "Construction Ltd",
    fechaRegistro: "2024-03-01",
    estado: "Inactivo",
  },
  {
    id: 8,
    nombre: "Carmen Flores",
    email: "carmen.flores@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 9,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 10,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 11,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 12,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 13,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 14,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 15,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 16,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 17,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
  {
    id: 18,
    nombre: "Carlos Hernandez",
    email: "carlos.hernandez@email.com",
    telefono: "+51 999 890 123",
    empresa: "Healthcare Plus",
    fechaRegistro: "2024-02-15",
    estado: "Activo",
  },
]

export const companiasMock: Companias[] = [
  {
    id: 1,
    nombre: "Tech Solutions SAC",
    direccion: "Av. Javier Prado 1234, San Isidro",
    telefono: "+51 1 234 5678",
    comentarios: ""
  },
  {
    id: 2,
    nombre: "Innovate Corp EIRL",
    direccion: "Jr. Las Flores 567, Miraflores",
    telefono: "+51 1 345 6789",
    comentarios: ""
  },
  {
    id: 3,
    nombre: "Digital Marketing Pro SAC",
    direccion: "Av. Arequipa 890, Lince",
    telefono: "+51 1 456 7890",
    comentarios: ""
  },
  {
    id: 4,
    nombre: "Consulting Group SRL",
    direccion: "Calle Los Olivos 123, San Borja",
    telefono: "+51 1 567 8901",
    comentarios: ""
  },
  {
    id: 5,
    nombre: "Finance Solutions SAC",
    direccion: "Av. El Sol 456, Surco",
    telefono: "+51 1 678 9012",
    comentarios: ""
  },
  {
    id: 6,
    nombre: "Creative Agency EIRL",
    direccion: "Jr. Creatividad 789, Barranco",
    telefono: "+51 1 789 0123",
    comentarios: ""
  },
  {
    id: 7,
    nombre: "Construction Ltd SAC",
    direccion: "Av. Construcción 321, Ate",
    telefono: "+51 1 890 1234",
    comentarios: ""
  },
  {
    id: 8,
    nombre: "Healthcare Plus SRL",
    direccion: "Calle Salud 654, San Miguel",
    telefono: "+51 1 901 2345",
    comentarios: ""
  },
  {
    id: 9,
    nombre: "Construction Ltd SAC",
    direccion: "Av. Construcción 321, Ate",
    telefono: "+51 1 890 1234",
    comentarios: ""
  },
  {
    id: 10,
    nombre: "Healthcare Plus SRL",
    direccion: "Calle Salud 654, San Miguel",
    telefono: "+51 1 901 2345",
    comentarios: ""
  },
  {
    id: 11,
    nombre: "Construction Ltd SAC",
    direccion: "Av. Construcción 321, Ate",
    telefono: "+51 1 890 1234",
    comentarios: ""
  },
]

export interface Cheque {
  id: number
  numero: string
  banco: string
  monto: number
  fecha: string
  fechaVencimiento: string
  beneficiario: string
  concepto: string
  estado: "Pendiente" | "Cobrado" | "Rechazado" | "Vencido"
  empresa: string
}

export const chequesMock: Cheque[] = [
  {
    id: 1,
    numero: "001234567",
    banco: "Banco de Crédito del Perú",
    monto: 15000.0,
    fecha: "2024-01-15",
    fechaVencimiento: "2024-02-15",
    beneficiario: "Tech Solutions SAC",
    concepto: "Pago por servicios de desarrollo",
    estado: "Cobrado",
    empresa: "Innovate Corp",
  },
  {
    id: 2,
    numero: "001234568",
    banco: "Interbank",
    monto: 8500.5,
    fecha: "2024-01-20",
    fechaVencimiento: "2024-02-20",
    beneficiario: "Digital Marketing Pro SAC",
    concepto: "Campaña publicitaria Q1",
    estado: "Pendiente",
    empresa: "Creative Agency",
  },
  {
    id: 3,
    numero: "001234569",
    banco: "BBVA Continental",
    monto: 25000.0,
    fecha: "2024-01-10",
    fechaVencimiento: "2024-02-10",
    beneficiario: "Consulting Group SRL",
    concepto: "Consultoría estratégica",
    estado: "Vencido",
    empresa: "Finance Solutions",
  },
  {
    id: 4,
    numero: "001234570",
    banco: "Scotiabank",
    monto: 12750.25,
    fecha: "2024-02-01",
    fechaVencimiento: "2024-03-01",
    beneficiario: "Construction Ltd SAC",
    concepto: "Materiales de construcción",
    estado: "Pendiente",
    empresa: "Healthcare Plus",
  },
  {
    id: 5,
    numero: "001234571",
    banco: "Banco de la Nación",
    monto: 5500.0,
    fecha: "2024-01-25",
    fechaVencimiento: "2024-02-25",
    beneficiario: "Creative Agency EIRL",
    concepto: "Diseño de identidad corporativa",
    estado: "Cobrado",
    empresa: "Tech Solutions",
  },
  {
    id: 6,
    numero: "001234572",
    banco: "Banco de Crédito del Perú",
    monto: 18900.75,
    fecha: "2024-02-05",
    fechaVencimiento: "2024-03-05",
    beneficiario: "Finance Solutions SAC",
    concepto: "Auditoría financiera",
    estado: "Rechazado",
    empresa: "Consulting Group",
  },
  {
    id: 7,
    numero: "001234573",
    banco: "Interbank",
    monto: 7200.0,
    fecha: "2024-02-10",
    fechaVencimiento: "2024-03-10",
    beneficiario: "Healthcare Plus SRL",
    concepto: "Equipos médicos",
    estado: "Pendiente",
    empresa: "Construction Ltd",
  },
  {
    id: 8,
    numero: "001234574",
    banco: "BBVA Continental",
    monto: 32000.5,
    fecha: "2024-02-15",
    fechaVencimiento: "2024-03-15",
    beneficiario: "Tech Solutions SAC",
    concepto: "Desarrollo de aplicación móvil",
    estado: "Cobrado",
    empresa: "Digital Marketing Pro",
  },
]
