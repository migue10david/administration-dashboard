import z from "zod";

export const countryFormSchema = z.object({
    name: z.string().min(3).max(50),
    code: z.string().min(1).max(3),
})

export type countryFormSchema = z.infer<typeof countryFormSchema>

export const companyFormSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
})

export type CompanyFormValues = z.infer<typeof companyFormSchema>