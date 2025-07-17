import { z } from "zod";

// Primero definimos el enum para EstadoCheque (asumiendo los posibles valores)
const statusCheckSchema = z.enum(["PENDIENTE", "PROCESADO"]);

// Esquema base para Cheque
export const CheckSchema = z.object({
  id: z.string().cuid(),
  clienteId: z.string(),
  companiaId: z.string(),
  fechaActual: z.date().default(() => new Date()),
  fechaCheque: z.date(),
  cantidad: z.number().positive(),
  comision: z.number().nonnegative(),
  subtotal: z.number().positive(),
  estado: statusCheckSchema.default("PENDIENTE"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
  userId: z.string().uuid()
});

// Esquema para crear un nuevo Cheque (omitiendo los campos autogenerados)
export const CreateCheckSchema = CheckSchema.omit({ 
  id: true,
  fechaActual: true,
  createdAt: true,
  updatedAt: true 
}).extend({
  fechaCheque: z.string().datetime().transform(str => new Date(str))
});

// Esquema para actualizar un Cheque
export const UpdateCheckSchema = CheckSchema.partial()
  .omit({ 
    id: true,
    clienteId: true,
    companiaId: true,
    createdAt: true,
    fechaActual: true
  })
  .extend({
    fechaCheque: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined)
  });

// Esquema para filtros/búsqueda
export const FilterCheckSchema = z.object({
  clienteId: z.string().optional(),
  companiaId: z.string().optional(),
  estado: statusCheckSchema.optional(),
  fechaDesde: z.string().datetime().optional(),
  fechaHasta: z.string().datetime().optional(),
  cantidadMin: z.number().optional(),
  cantidadMax: z.number().optional()
}).partial();

export type Check = z.infer<typeof CheckSchema>;
export type CreateCheckInput = z.infer<typeof CreateCheckSchema>;
export type UpdateCheckInput = z.infer<typeof UpdateCheckSchema>;
export type FilterCheckInput = z.infer<typeof FilterCheckSchema>;
export type StatusCheck = z.infer<typeof statusCheckSchema>;