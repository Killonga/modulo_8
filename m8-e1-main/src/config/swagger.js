import swaggerUi from "swagger-ui-express";
import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { TareaSchema, crearTareaSchema } from "../schemas/tareas.schema.js";
import { idSchema } from "../schemas/common.schemas.js";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

/**
 * Register Tarea schema
 */
registry.register("Tarea", TareaSchema);

/**
 * GET /tareas - Obtener todas las tareas
 */
registry.registerPath({
  method: "get",
  path: "/api/tareas",
  summary: "Obtener todas las tareas",
  responses: {
    200: {
      description: "Lista de tareas",
      content: {
        "application/json": {
          schema: z.array(TareaSchema),
        },
      },
    },
  },
});

/**
 * POST /tareas - Crear una tarea
 */
registry.registerPath({
  method: "post",
  path: "/api/tareas",
  summary: "Crear una tarea",
  request: {
    body: {
      content: {
        "application/json": {
          schema: crearTareaSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Tarea creada",
      content: {
        "application/json": {
          schema: TareaSchema,
        },
      },
    },
  },
});

/**
 * GET /tareas/:id - Obtener tarea por ID
 */
registry.registerPath({
  method: "get",
  path: "/api/tareas/{id}",
  summary: "Obtener una tarea por ID",
  request: {
    params: idSchema,
  },
  responses: {
    200: {
      description: "Tarea encontrada",
      content: {
        "application/json": {
          schema: TareaSchema,
        },
      },
    },
    404: {
      description: "Tarea no encontrada",
    },
  },
});

/**
 * PUT /tareas/:id - Actualizar tarea
 */
registry.registerPath({
  method: "put",
  path: "/api/tareas/{id}",
  summary: "Actualizar una tarea",
  request: {
    params: idSchema,
    body: {
      content: {
        "application/json": {
          schema: crearTareaSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Tarea actualizada",
      content: {
        "application/json": {
          schema: TareaSchema,
        },
      },
    },
    404: {
      description: "Tarea no encontrada",
    },
  },
});

/**
 * DELETE /tareas/:id - Eliminar tarea
 */
registry.registerPath({
  method: "delete",
  path: "/api/tareas/{id}",
  summary: "Eliminar una tarea",
  request: {
    params: idSchema,
  },
  responses: {
    204: {
      description: "Tarea eliminada",
    },
    404: {
      description: "Tarea no encontrada",
    },
  },
});

/**
 * POST /upload/avatar/:userId - Subir avatar
 */
registry.registerPath({
  method: "post",
  path: "/api/upload/avatar/{userId}",
  summary: "Subir avatar de usuario",
  request: {
    params: z.object({
      userId: z.string().openapi({ example: "123" }),
    }),
  },
  responses: {
    200: {
      description: "Avatar subido exitosamente",
    },
    400: {
      description: "Archivo no válido o extensión no permitida",
    },
  },
});

/**
 * Generate OpenAPI document
 */
export const openApiDocument = new OpenApiGeneratorV3(
  registry.definitions
).generateDocument({
  openapi: "3.0.0",
  info: {
    title: "API de Tareas",
    version: "1.0.0",
    description: "API RESTful para gestión de tareas con operaciones CRUD",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de desarrollo",
    },
  ],
});

/**
 * Swagger UI middleware
 */
export const swaggerMiddleware = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(openApiDocument, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "API de Tareas - Documentación",
});