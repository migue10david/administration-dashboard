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
    customerId: z.string(),
    recipientId: z.string(),
    companyId: z.string(),
    amount: z.number(),
    feed: z.number()
})

export type WireTransferFormValues = z.infer<typeof wireTransferFormSchema>

export const SettingFormSchema = z.object({
  name: z.string().min(3).max(50),       
  code: z.string().min(1).max(3),     
  zipCode: z.string().min(3).max(5),    
  cityId: z.string(),
  stateId: z.string(),
  numCustomerRate: z.number(),
  customerPercentRate: z.number(),
  moneyOrderFeed: z.number(),
  maxBankDepositLimit: z.number(),
  minimunAge: z.number()
})

export type SettingFormValues = z.infer<typeof SettingFormSchema>
