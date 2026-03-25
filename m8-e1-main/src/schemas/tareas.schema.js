import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

/**
 * Schema para representar una tarea completa
 */
export const TareaSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  titulo: z.string().openapi({ example: "Estudiar Node.js" }),
  descripcion: z.string().optional().openapi({ example: "Aprender Express" }),
  completada: z.boolean().openapi({ example: false }),
});

/**
 * Schema para crear una nueva tarea
 */
export const crearTareaSchema = z.object({
  titulo: z
    .string({
      required_error: "El título es obligatorio",
      invalid_type_error: "El título debe ser una cadena de texto",
    })
    .min(1, "El título no puede estar vacío")
    .max(255, "El título no puede exceder 255 caracteres")
    .openapi({ example: "Nueva tarea" }),
  descripcion: z
    .string()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional()
    .openapi({ example: "Descripción de la tarea" }),
  completada: z
    .boolean()
    .optional()
    .default(false)
    .openapi({ example: false }),
});

/**
 * Schema para actualizar una tarea (todos los campos opcionales)
 */
export const actualizarTareaSchema = crearTareaSchema.partial();

/**
 * Schema para respuesta de lista de tareas
 */
export const TareaListResponseSchema = z.object({
  ok: z.boolean(),
  data: z.array(TareaSchema),
});

/**
 * Schema para respuesta de una tarea
 */
export const TareaResponseSchema = z.object({
  ok: z.boolean(),
  data: TareaSchema,
});

/**
 * Schema para respuesta de error
 */
export const ErrorResponseSchema = z.object({
  ok: z.boolean(),
  message: z.string().optional(),
  errores: z.array(z.object()).optional(),
});
