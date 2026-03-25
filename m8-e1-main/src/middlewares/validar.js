import { ZodError } from "zod";

/**
 * Middleware para validar el cuerpo de la solicitud contra un schema de Zod
 * @param {import('zod').ZodSchema} schema - Schema de Zod a validar
 * @returns {Function} Middleware de Express
 */
export const validarBody = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    req.body = data;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Error de validación en el cuerpo de la solicitud",
        errores: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      ok: false,
      message: "Error interno al validar los datos",
    });
  }
};

/**
 * Middleware para validar los parámetros de ruta contra un schema de Zod
 * @param {import('zod').ZodSchema} schema - Schema de Zod a validar
 * @returns {Function} Middleware de Express
 */
export const validarParams = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.params);
    req.params = data;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Error de validación en los parámetros de la solicitud",
        errores: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      ok: false,
      message: "Error interno al validar los parámetros",
    });
  }
};

/**
 * Middleware para validar los query parameters contra un schema de Zod
 * @param {import('zod').ZodSchema} schema - Schema de Zod a validar
 * @returns {Function} Middleware de Express
 */
export const validarQuery = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.query);
    req.query = data;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        ok: false,
        message: "Error de validación en los query parameters",
        errores: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      ok: false,
      message: "Error interno al validar los query parameters",
    });
  }
};
