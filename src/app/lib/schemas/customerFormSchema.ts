import z from "zod";

export const CustomerSchema = z.object({
  id: z.string().cuid(),
  code: z.string().min(1),
  firstName: z.string().min(3).max(20),
  middleName: z.string().optional(),
  lastNameOne: z.string().min(3).max(30),
  lastNameTwo: z.string().min(3).max(30),
  address: z.string().min(3).max(50),
  apartment: z.string().optional(),
  zipCode: z.string().min(1).max(5),
  phone: z
    .string()
    .min(10)
    .regex(/^[0-9+]+$/),
  dob: z.date(),
  ssn: z.string().min(9).max(11),
  dlid: z.string().optional(),
  imageUrl: z.string().optional(),
  percentage: z.number().min(0).max(100).default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
  isActive: z.boolean().default(true),
  type: z.enum(["CUSTOMER", "RECIPIENT"]).default("CUSTOMER"),
  notes: z.string().optional(),
  countryId: z.string(),
  stateId: z.string(),
  cityId: z.string(),
  createdById: z.string(),
  // Relaciones
  country: z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    customers: z.array(z.string()),
    cheques: z.array(z.string()),
  }),
  state: z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    countryId: z.string(),
    country: z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      customers: z.array(z.string()),
      cheques: z.array(z.string()),
    }),
    cities: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
    customers: z.array(z.string()),
    cheques: z.array(z.string()),
  }),
  city: z.object({
    id: z.string(),
    name: z.string(),
    stateId: z.string(),
    state: z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
      countryId: z.string(),
      country: z.object({
        id: z.string(),
        name: z.string(),
        code: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        customers: z.array(z.string()),
        cheques: z.array(z.string()),
      }),
      cities: z.array(z.string()),
      createdAt: z.date(),
      updatedAt: z.date(),
      customers: z.array(z.string()),
      cheques: z.array(z.string()),
    }),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  // Relaciones inversas
  checkTransaction: z.array(z.string()).optional(), // Relación uno a muchos (inversa)
  WireTransfer: z.array(z.string()).optional(), // Relación uno a muchos (inversa)
});

export const CustomerFormSchema = z.object({
  code: z.string().min(1).max(8),
  firstName: z.string().min(3).max(20),
  middleName: z.string().optional(),
  lastNameOne: z.string().min(3).max(30),
  lastNameTwo: z.string().min(3).max(30),
  address: z.string().min(3).max(50),
  apartment: z.string().optional(),
  zipCode: z.string().min(1).max(5),
  phone: z
    .string()
    .min(10)
    .regex(/^[0-9+]+$/),
  dob: z.date(),
  ssn: z.string().min(9).max(11),
  dlid: z.string().min(9).max(11),


  percentage: z.number().min(1).max(3),
 
  
  notes: z.string().optional(),
  countryId: z.string(),
  stateId: z.string(),
  cityId: z.string(),
});

export type CustomerFormValues = z.infer<typeof CustomerFormSchema>;

// Esquema para crear un nuevo Cliente (omitiendo campos autogenerados)
export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
  country: true, // Omitir el objeto completo
  state: true, // Omitir el objeto completo
  city: true, // Omitir el objeto completo
  checkTransaction: true,
  WireTransfer: true,
}).extend({
  countryId: z.string(), // Añadir solo el ID
  stateId: z.string(),
  cityId: z.string(),
});

export const CreateCustomerFormSchema = z.object({
  code: z.string().min(1).max(8),
  firstName: z.string().min(3).max(20),
  middleName: z.string().optional(),
  lastNameOne: z.string().min(3).max(30),
  lastNameTwo: z.string().min(3).max(30),
  address: z.string().min(3).max(50),
  apartment: z.string().optional(),
  zipCode: z.string().min(1).max(5),
  phone: z
    .string()
    .min(10)
    .regex(/^[0-9+]+$/),
  dob: z.date(),
  ssn: z.string().min(9).max(11),
  dlid: z.string().optional(),

  percentage: z.number().min(0, "Porcentaje no puede ser negativo").max(100, "Porcentaje no puede ser mayor a 100"),
  
  notes: z.string().optional(),
  countryId: z.string(),
  stateId: z.string(),
  cityId: z.string(),
});

export type CreateCustomerFormValues = z.infer<typeof CreateCustomerFormSchema>;

// Esquema para actualizar un Cliente
export const UpdateClienteSchema = CreateCustomerSchema.partial().extend({});

// Esquema para filtros/búsqueda
export const FilterClienteSchema = z
  .object({
    code: z.string().optional(),
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastNameOne: z.string().optional(),
    lastNameTwo: z.string().optional(),
    phone: z.string().optional(),
  })
  .partial();

// Tipos TypeScript derivados
export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateClienteSchema>;
export type FilterCustomerInput = z.infer<typeof FilterClienteSchema>;
