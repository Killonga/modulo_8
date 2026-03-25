import express from "express";
import {
  obtenerTareas,
  crearTarea,
  obtenerTareaPorId,
  eliminarTarea,
  actualizarTarea,
} from "../controllers/tareas.controller.js";

import {
  crearTareaSchema,
  actualizarTareaSchema,
  idSchema,
} from "../schemas/index.js";

import { validarBody, validarParams } from "../middlewares/index.js";

const router = express.Router();

/**
 * @route GET /api/tareas
 * @description Obtener todas las tareas
 * @access Public
 */
router.get("/", obtenerTareas);

/**
 * @route POST /api/tareas
 * @description Crear una nueva tarea
 * @access Public
 */
router.post("/", validarBody(crearTareaSchema), crearTarea);

/**
 * @route GET /api/tareas/:id
 * @description Obtener una tarea por ID
 * @access Public
 */
router.get("/:id", validarParams(idSchema), obtenerTareaPorId);

/**
 * @route PUT /api/tareas/:id
 * @description Actualizar una tarea
 * @access Public
 */
router.put(
  "/:id",
  validarParams(idSchema),
  validarBody(actualizarTareaSchema),
  actualizarTarea
);

/**
 * @route DELETE /api/tareas/:id
 * @description Eliminar una tarea
 * @access Public
 */
router.delete("/:id", validarParams(idSchema), eliminarTarea);

export default router;
