import z from "zod";

export const CustomerSchema = z.object({
  id: z.string().cuid(),
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
  imageUrl: z
    .string()
    .url("La URL de la imagen no es válida")
    .optional()
    .or(z.literal("")), // Permite string vacío
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
  status: z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    customers: z.array(z.string()),
    cheques: z.array(z.string()),
  }),
  // Relaciones inversas
  checkTransaction: z.array(z.string()).optional(), // Relación uno a muchos (inversa)
  WireTransfer: z.array(z.string()).optional(), // Relación uno a muchos (inversa)
});

export type CustomerFormValues = z.infer<typeof CustomerSchema>;

// Esquema para crear un nuevo Cliente (omitiendo campos autogenerados)
export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  country: true,
  state: true,
  city: true,
  checkTransaction: true,
  WireTransfer: true,
}).extend({
  imageUrl: z.string().optional().default(""),
});

// Esquema para actualizar un Cliente
export const UpdateClienteSchema = CreateCustomerSchema.partial().extend({
});

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
