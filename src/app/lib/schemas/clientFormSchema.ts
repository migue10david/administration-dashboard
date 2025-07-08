import z from "zod";

export const clientFormSchema = z.object({
    nombre: z.string().min(3).max(50),
    direccion: z.string().min(3).max(50),
    telefono: z.string().min(3).max(50),
    nacionalidad: z.string().min(3).max(50),
    imageUrl: z.string().min(3).max(50),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>

export const ClienteSchema = z.object({
  id: z.string().cuid(),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 caracteres")
    .regex(/^[0-9+]+$/, "El teléfono solo puede contener números y el signo +"),
  nacionalidad: z.string().min(3, "Debe especificar una nacionalidad válida"),
  imageUrl: z.string().url("La URL de la imagen no es válida")
    .optional()
    .or(z.literal("")), // Permite string vacío
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date()
});

// Esquema para crear un nuevo Cliente (omitiendo campos autogenerados)
export const CreateClienteSchema = ClienteSchema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true 
}).extend({
  imageUrl: z.string().url().optional().default("")
});

// Esquema para actualizar un Cliente
export const UpdateClienteSchema = CreateClienteSchema.partial()
  .extend({
    nombre: z.string().min(2).optional(),
    telefono: z.string().min(8).regex(/^[0-9+]+$/).optional()
  });

// Esquema para filtros/búsqueda
export const FilterClienteSchema = z.object({
  nombre: z.string().optional(),
  nacionalidad: z.string().optional(),
  telefono: z.string().optional()
}).partial();

// Tipos TypeScript derivados
export type Cliente = z.infer<typeof ClienteSchema>;
export type CreateClienteInput = z.infer<typeof CreateClienteSchema>;
export type UpdateClienteInput = z.infer<typeof UpdateClienteSchema>;
export type FilterClienteInput = z.infer<typeof FilterClienteSchema>;