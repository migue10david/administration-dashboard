import z from "zod";


export const clientFormSchema = z.object({
    nombre: z.string().min(3).max(50),
    direccion: z.string().min(3).max(50),
    telefono: z.string().min(3).max(50),
    nacionalidad: z.string().min(3).max(50),
    imageUrl: z.string().min(3).max(50),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>