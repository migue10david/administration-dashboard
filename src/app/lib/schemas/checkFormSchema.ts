import z from "zod";

export const checkFormSchema = z.object({
    customerId: z.string(),
    checkTransactionTypeId: z.string(),
    number: z.string().min(1).max(10),
    amount: z.number(),
    feed: z.number()
})

export type CheckFormValues = z.infer<typeof checkFormSchema>;