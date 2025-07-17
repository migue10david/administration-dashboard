import z from "zod";


export const companyFormSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().optional(),
})

export type CompanyFormValues = z.infer<typeof companyFormSchema>