import z from "zod";

export const countryFormSchema = z.object({
    name: z.string().min(3).max(50),
    code: z.string().min(1).max(3),
})

export type CountryFormValues = z.infer<typeof countryFormSchema>

export const stateFormSchema = z.object({
    name: z.string().min(3).max(50),
    code: z.string().min(1).max(3),
    countryId: z.string()
})

export type StateFormValues = z.infer<typeof stateFormSchema>

export const cityFormSchema = z.object({
    name: z.string().min(3).max(50),
    code: z.string().min(1).max(3),
    stateId: z.string()
})

export type CityFormValues = z.infer<typeof cityFormSchema>


export const companyFormSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
})

export type CompanyFormValues = z.infer<typeof companyFormSchema>


export const checkTransactionTypeFormSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
})

export type CheckTransactionTypeFormValues = z.infer<typeof checkTransactionTypeFormSchema>

export const CheckTransactionFormSchema = z.object({
    customerId: z.string(),
    checkTransactionTypeId: z.string(),
    number: z.string().min(1).max(10),
    amount: z.number(),
    feed: z.number()
})

export type CheckTransactionFormValues = z.infer<typeof CheckTransactionFormSchema>

export const wireTransferFormSchema = z.object({
    customerId: z.string().min(1, "Seleccione el Cliente"),
    recipientId: z.string().min(1, "Seleccione Beneficiario"),
    companyId: z.string().min(1, "Seleccione Compañia"),
    amount: z.number().min(100, "Minímo a transferir 100").max(10000),
    feed: z.number().min(0).max(100),
})

export type WireTransferFormValues = z.infer<typeof wireTransferFormSchema>

export const SystemSettingSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(3).max(50),
  code: z.string().min(1).max(4),
  zipCode: z.string().min(3).max(5),
  numCustomerPercentRate: z.number(),
  customerPercentRate: z.number(),
  moneyOrderFeed: z.number(),
  maxBankDepositLimit: z.number().int(),
  minimunAge: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // Relación con City (opcional)
  cityId: z.string().cuid().optional(),
  city: z.object({
    id: z.string().cuid(),
    name: z.string(),
    code: z.string(),
    isActive: z.boolean(),
  }).optional(),

  // Relación con City (opcional)
  stateId: z.string().cuid().optional(),
  state: z.object({
    id: z.string().cuid(),
    name: z.string(),
    code: z.string(),
    isActive: z.boolean(),
  }).optional()


});

export const UpdateSystemSettingSchema = SystemSettingSchema
  .omit({ 
    id: true,
    createdAt: true,
    updatedAt: true,
    city: true, // Excluir el objeto completo de City
    state: true // Excluir el objeto completo de State
  })
  .extend({
    // Campos opcionales para actualización
    cityId: z.string().cuid().optional(), // Solo el ID, no el objeto completo
    stateId: z.string().cuid().optional() // Solo el ID, no el objeto completo
  });

export type UpdateSystemSettingInput = z.infer<typeof UpdateSystemSettingSchema>;