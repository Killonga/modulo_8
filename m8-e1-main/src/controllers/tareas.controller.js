import { Tarea } from "../models/index.js";

/**
 * Obtener todas las tareas
 * @route GET /api/tareas
 */
export const obtenerTareas = async (req, res, next) => {
  try {
    const tareas = await Tarea.findAllTareas();
    res.status(200).json({ ok: true, data: tareas });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva tarea
 * @route POST /api/tareas
 */
export const crearTarea = async (req, res, next) => {
  try {
    const tarea = await Tarea.createTarea(req.body);
    res.status(201).json({ ok: true, data: tarea });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una tarea por ID
 * @route GET /api/tareas/:id
 */
export const obtenerTareaPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findTareaById(id);

    if (!tarea) {
      return res.status(404).json({
        ok: false,
        message: "Tarea no encontrada",
      });
    }

    res.status(200).json({ ok: true, data: tarea });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una tarea
 * @route DELETE /api/tareas/:id
 */
export const eliminarTarea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Tarea.deleteTarea(id);

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: "Tarea no encontrada",
      });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una tarea
 * @route PUT /api/tareas/:id
 */
export const actualizarTarea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.updateTarea(id, req.body);

    if (!tarea) {
      return res.status(404).json({
        ok: false,
        message: "Tarea no encontrada",
      });
    }

    res.status(200).json({ ok: true, data: tarea });
  } catch (error) {
    next(error);
  }
};

export default {
  obtenerTareas,
  crearTarea,
  obtenerTareaPorId,
  eliminarTarea,
  actualizarTarea,
};
