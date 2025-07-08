import z from "zod";


export const companiaFormSchema = z.object({
    nombre: z.string().min(3).max(50),
    direccion: z.string().min(3).max(50),
    telefono: z.string().min(3).max(50),
    comentarios: z.string().optional(),
})