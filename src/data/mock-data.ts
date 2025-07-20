export interface Customer {
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
}

export const mockCustomers: Customer[] = [
  {
    id: 1,
    code: 'CUST-001',
    firstName: 'John',
    middleName: 'Michael',
    lastNameOne: 'Smith',
    lastNameTwo: 'Johnson',
    address: '123 Main St',
    apartment: 'Apt 4B',
    countryId: 1,  // US
    stateId: 33,   // New York
    cityId: 501,   // New York City
    zipCode: '10001',
    phone: '+1 555-123-4567',
    dob: new Date('1985-05-15'),
    ssn: '123-45-6789',
    dlid: 'DL12345678',
    imageUrl: '/image1.jpeg',
    percentage: 15.5,
    isActive: true,
    notes: 'Preferred customer, VIP status'
  },
  {
    id: 2,
    code: 'CUST-002',
    firstName: 'Maria',
    lastNameOne: 'Garcia',
    address: '456 Oak Ave',
    countryId: 1,  // US
    stateId: 5,    // California
    cityId: 502,   // Los Angeles
    zipCode: '90001',
    phone: '+1 555-987-6543',
    dob: new Date('1990-11-22'),
    ssn: '987-65-4321',
    dlid: 'DL87654321',
    percentage: 10.0,
    isActive: true
  },
  {
    id: 3,
    code: 'CUST-003',
    firstName: 'Robert',
    lastNameOne: 'Williams',
    lastNameTwo: 'Brown',
    address: '789 Pine Rd',
    apartment: 'Unit 12',
    countryId: 2,  // Canada
    stateId: 8,    // Ontario
    cityId: 601,   // Toronto
    zipCode: 'M5V 2T6',
    phone: '+1 416-555-7890',
    dob: new Date('1978-03-30'),
    ssn: '456-78-9012',
    dlid: 'DL45678901',
    percentage: 5.0,
    isActive: false,
    notes: 'Inactive since 2022'
  },
  {
    id: 4,
    code: 'CUST-004',
    firstName: 'Li',
    middleName: 'Wei',
    lastNameOne: 'Zhang',
    address: '321 Elm Blvd',
    countryId: 3,  // China
    stateId: 22,   // Beijing
    cityId: 701,   // Beijing
    zipCode: '100000',
    phone: '+86 10 5555 8888',
    dob: new Date('1992-07-18'),
    ssn: '789-01-2345',
    dlid: 'DL78901234',
    imageUrl: '/image1.jpeg',
    percentage: 20.0,
    isActive: true
  },
  {
    id: 5,
    code: 'CUST-005',
    firstName: 'Sophie',
    middleName: 'Anne',
    lastNameOne: 'Martin',
    address: '654 Maple Ln',
    countryId: 4,  // France
    stateId: 11,   // Île-de-France
    cityId: 801,   // Paris
    zipCode: '75001',
    phone: '+33 1 55 55 55 55',
    dob: new Date('1988-12-05'),
    ssn: '345-67-8901',
    dlid: 'DL34567890',
    percentage: 12.5,
    isActive: true,
    notes: 'Frequent buyer, prefers email communication'
  },
  {
    id: 6,
    code: 'CUST-006',
    firstName: 'Carlos',
    lastNameOne: 'Rodriguez',
    address: '987 Cedar St',
    countryId: 5,  // Mexico
    stateId: 9,    // Ciudad de México
    cityId: 901,   // Mexico City
    zipCode: '06000',
    phone: '+52 55 5555 5555',
    dob: new Date('1980-09-14'),
    ssn: '567-89-0123',
    dlid: 'DL56789012',
    percentage: 8.0,
    isActive: true
  },
  {
    id: 7,
    code: 'CUST-007',
    firstName: 'Aisha',
    middleName: 'Fatima',
    lastNameOne: 'Khan',
    address: '159 Birch Ave',
    apartment: 'Floor 3, Apt 302',
    countryId: 6,  // UAE
    stateId: 7,    // Dubai
    cityId: 1001,  // Dubai
    zipCode: '12345',
    phone: '+971 4 555 5555',
    dob: new Date('1995-02-28'),
    ssn: '678-90-1234',
    dlid: 'DL67890123',
    percentage: 18.0,
    isActive: true,
    notes: 'Corporate account'
  },
  {
    id: 8,
    code: 'CUST-008',
    firstName: 'James',
    lastNameOne: 'Wilson',
    address: '753 Spruce Dr',
    countryId: 7,  // UK
    stateId: 12,   // England
    cityId: 1101,  // London
    zipCode: 'SW1A 1AA',
    phone: '+44 20 5555 5555',
    dob: new Date('1975-08-10'),
    ssn: '890-12-3456',
    dlid: 'DL89012345',
    percentage: 7.5,
    isActive: false
  }
];

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
