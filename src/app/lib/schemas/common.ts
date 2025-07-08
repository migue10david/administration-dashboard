import { z } from "zod";

// Esquema para filtros
export const FilterSchema = z.object({
  search: z.string().optional()
})

// Esquema para paginación
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10)
})

export type PaginationInput = z.infer<typeof PaginationSchema>
