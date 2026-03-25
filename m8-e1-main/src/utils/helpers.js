/**
 * Funciones auxiliares de la aplicación
 */

import { PAGINATION } from "./constants.js";

/**
 * Formatear respuesta exitosa estándar
 * @param {any} data - Datos a retornar
 * @param {string} message - Mensaje opcional
 * @returns {object} Respuesta formateada
 */
export const formatSuccessResponse = (data, message = null) => {
  const response = {
    ok: true,
    data,
  };
  if (message) {
    response.message = message;
  }
  return response;
};

/**
 * Formatear respuesta de error estándar
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 * @param {array} errores - Errores detallados (opcional)
 * @returns {object} Respuesta de error formateada
 */
export const formatErrorResponse = (
  message,
  statusCode = 500,
  errores = null
) => {
  const response = {
    ok: false,
    message,
  };
  if (errores) {
    response.errores = errores;
  }
  return response;
};

/**
 * Calcular paginación
 * @param {number} page - Número de página
 * @param {number} limit - Límite de elementos por página
 * @param {number} total - Total de elementos
 * @returns {object} Metadata de paginación
 */
export const calculatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page: Number(page),
    limit: Number(limit),
    total: Number(total),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Obtener valores de paginación con defaults seguros
 * @param {object} query - Query params de la request
 * @returns {object} Valores de paginación
 */
export const getPaginationValues = (query) => {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  return { page, limit };
};

/**
 * Validar que un string sea un número válido
 * @param {string} value - Valor a validar
 * @returns {boolean} True si es válido
 */
export const isValidNumber = (value) => {
  const num = parseInt(value);
  return !isNaN(num) && num > 0;
};

/**
 * Obtener extensión de archivo
 * @param {string} fileName - Nombre del archivo
 * @returns {string} Extensión en minúsculas
 */
export const getFileExtension = (fileName) => {
  return fileName.split(".").pop().toLowerCase();
};

/**
 * Verificar si la extensión es válida
 * @param {string} extension - Extensión a verificar
 * @param {array} allowedExtensions - Array de extensiones permitidas
 * @returns {boolean} True si es válida
 */
export const isValidExtension = (extension, allowedExtensions) => {
  return allowedExtensions.includes(extension.toLowerCase());
};

/**
 * Obtener objeto de paginación para respuestas
 * @param {object} query - Query params
 * @param {number} totalItems - Total de items
 * @returns {object} Objeto de paginación
 */
export const getPaginationMeta = (query, totalItems) => {
  const { page, limit } = getPaginationValues(query);
  const pagination = calculatePagination(page, limit, totalItems);
  return pagination;
};

/**
 * Convertir errores de Zod a formato legible
 * @param {Error} error - Error de Zod
 * @returns {array} Array de errores formateados
 */
export const formatZodErrors = (error) => {
  return error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
};