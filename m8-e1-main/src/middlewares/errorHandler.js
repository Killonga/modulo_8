/**
 * Middleware para manejo global de errores
 * @param {Error} err - Error capturado
 * @param {import('express').Request} req - Objeto de solicitud de Express
 * @param {import('express').Response} res - Objeto de respuesta de Express
 * @param {import('express').NextFunction} next - Función next de Express
 */
export const errorHandler = (err, req, res, next) => {
  // Log del error en desarrollo
  if (process.env.NODE_ENV === "development") {
    console.error("ErrorStack:", err.stack);
  }

  // Error de validación de Sequelize
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      ok: false,
      message: "Error de validación en la base de datos",
      errores: err.errors.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });
  }

  // Error de restricción de integridad de Sequelize
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      ok: false,
      message: "Conflicto de datos: el recurso ya existe",
      errores: err.errors.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });
  }

  // Error de conexión a la base de datos
  if (err.name === "SequelizeConnectionError") {
    return res.status(503).json({
      ok: false,
      message: "Servicio de base de datos no disponible",
    });
  }

  // Error personalizado de la aplicación
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message || "Error del servidor",
    });
  }

  // Error de Zod no capturado
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(400).json({
      ok: false,
      message: "Error de validación",
      errores: err.errors,
    });
  }

  // Error genérico del servidor
  return res.status(500).json({
    ok: false,
    message: process.env.NODE_ENV === "development" 
      ? err.message 
      : "Error interno del servidor",
  });
};

/**
 * Middleware para rutas no encontradas (404)
 * @param {import('express').Request} req - Objeto de solicitud de Express
 * @param {import('express').Response} res - Objeto de respuesta de Express
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    ok: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
};

/**
 * Clase para errores personalizados de la aplicación
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Clase para errores de validación
 */
export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

/**
 * Clase para errores de recurso no encontrado
 */
export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Clase para errores de conflicto
 */
export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
    this.name = "ConflictError";
  }
}