import z from "zod";


export const clientFormSchema = z.object({
    nombre: z.string().min(3).max(50).optional(),
    direccion: z.string().min(3).max(50).optional(),
    telefono: z.string().min(3).max(50).optional(),
    nacionalidad: z.string().min(3).max(50).optional(),
    imageUrl: z.string().min(3).max(50).optional(),
})