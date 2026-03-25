/**
 * Constantes de la aplicación
 */

// Códigos de estado HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Mensajes de error
export const ERROR_MESSAGES = {
  // Errores genéricos
  INTERNAL_ERROR: "Error interno del servidor",
  NOT_FOUND: "Recurso no encontrado",
  BAD_REQUEST: "Solicitud incorrecta",

  // Errores de validación
  VALIDATION_ERROR: "Error de validación",
  INVALID_ID: "El ID proporcionado no es válido",

  // Errores de tareas
  TAREA_NOT_FOUND: "Tarea no encontrada",
  TAREA_TITLE_REQUIRED: "El título de la tarea es obligatorio",
  TAREA_ALREADY_EXISTS: "Ya existe una tarea con ese título",

  // Errores de uploads
  NO_FILE_UPLOADED: "No se ha subido ningún archivo",
  INVALID_FILE_EXTENSION: "Extensión de archivo no válida",
  FILE_TOO_LARGE: "El archivo excede el tamaño máximo permitido",
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  TAREA_CREATED: "Tarea creada exitosamente",
  TAREA_UPDATED: "Tarea actualizada exitosamente",
  TAREA_DELETED: "Tarea eliminada exitosamente",
  FILE_UPLOADED: "Archivo subido exitosamente",
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Extensiones de archivo permitidas para uploads
export const ALLOWED_IMAGE_EXTENSIONS = ["png", "jpg", "webp", "jpeg", "gif"];

// Tamaño máximo de archivo (en bytes) - 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;