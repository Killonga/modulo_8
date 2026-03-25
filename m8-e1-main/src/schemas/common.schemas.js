import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

/**
 * Schema para validar ID en parámetros de ruta
 */
export const idSchema = z.object({
  id: z.string().regex(/^\d+$/, "El ID debe ser numérico").openapi({
    description: "ID numérico de la tarea",
    example: "1",
  }),
});

/**
 * Schema para paginación
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .default("1")
    .transform(Number)
    .openapi({ example: "1" }),
  limit: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .default("10")
    .transform(Number)
    .openapi({ example: "10" }),
});

/**
 * Schema para respuesta de paginación
 */
export const PaginationResponseSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

/**
 * Schema para respuesta de éxito genérica
 */
export const SuccessResponseSchema = z.object({
  ok: z.boolean().openapi({ example: true }),
  message: z.string().optional(),
  data: z.any().optional(),
});

/**
 * Schema para respuesta de error genérica
 */
export const ApiErrorSchema = z.object({
  ok: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Error occurred" }),
  code: z.string().optional(),
  errores: z.array(z.object()).optional(),
});