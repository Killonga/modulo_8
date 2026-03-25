/**
 * Express Application Configuration
 * Configura el servidor Express con todos los middlewares y rutas
 */

import express from "express";
import fileUpload from "express-fileupload";
import { config, swaggerMiddleware, swaggerSetup } from "./config/index.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/index.js";

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Middleware para parsing de URL encoded
app.use(express.urlencoded({ extended: true }));

// Middleware para file upload
app.use(fileUpload());

// Documentación Swagger
app.use("/docs", swaggerMiddleware, swaggerSetup);

// Rutas API
app.use("/api", apiRoutes);

// Health check en raíz
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API de Tareas - Servidor funcionando",
    documentation: "/docs",
    endpoints: {
      tareas: "/api/tareas",
      uploads: "/api/upload/avatar/:userId",
      health: "/api/health",
    },
  });
});

// Middleware para manejo de errores 404
app.use(notFoundHandler);

// Middleware para manejo global de errores
app.use(errorHandler);

export default app;