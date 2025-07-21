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
    stateid: z.string()
})

export type CityFormValues = z.infer<typeof cityFormSchema>


export const companyFormSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
})

export type CompanyFormValues = z.infer<typeof companyFormSchema>


<<<<<<< HEAD
export const stateFormSchema = z.object({
    name: z.string().min(3).max(50),
    code: z.string().min(1).max(3),
    countryId: z.string()
})

export type StateFormValues = z.infer<typeof stateFormSchema>
=======
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
>>>>>>> 4a2076de595a668d151bd5c7d78ef8adb6285628
