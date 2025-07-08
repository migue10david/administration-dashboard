import { z } from "zod";

// Primero definimos el enum para EstadoCheque (asumiendo los posibles valores)
const EstadoChequeSchema = z.enum(["PENDIENTE", "PROCESADO"]);

// Esquema base para Cheque
export const ChequeSchema = z.object({
  id: z.string().cuid(),
  clienteId: z.string(),
  companiaId: z.string(),
  fechaActual: z.date().default(() => new Date()),
  fechaCheque: z.date(),
  cantidad: z.number().positive(),
  comision: z.number().nonnegative(),
  subtotal: z.number().positive(),
  estado: EstadoChequeSchema.default("PENDIENTE"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date(),
  userId: z.string().uuid()
});

// Esquema para crear un nuevo Cheque (omitiendo los campos autogenerados)
export const CreateChequeSchema = ChequeSchema.omit({ 
  id: true,
  fechaActual: true,
  createdAt: true,
  updatedAt: true 
}).extend({
  fechaCheque: z.string().datetime().transform(str => new Date(str))
});

// Esquema para actualizar un Cheque
export const UpdateChequeSchema = ChequeSchema.partial()
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
export const FilterChequeSchema = z.object({
  clienteId: z.string().optional(),
  companiaId: z.string().optional(),
  estado: EstadoChequeSchema.optional(),
  fechaDesde: z.string().datetime().optional(),
  fechaHasta: z.string().datetime().optional(),
  cantidadMin: z.number().optional(),
  cantidadMax: z.number().optional()
}).partial();

export type Cheque = z.infer<typeof ChequeSchema>;
export type CreateChequeInput = z.infer<typeof CreateChequeSchema>;
export type UpdateChequeInput = z.infer<typeof UpdateChequeSchema>;
export type FilterChequeInput = z.infer<typeof FilterChequeSchema>;
export type EstadoCheque = z.infer<typeof EstadoChequeSchema>;