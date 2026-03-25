import express from "express";
import tareasRoutes from "./tareas.routes.js";
import uploadsRoutes from "./uploads.routes.js";

const router = express.Router();

/**
 * Routes Index
 * Monta todas las rutas de la aplicación
 */

// Rutas de tareas (/api/tareas)
router.use("/tareas", tareasRoutes);

// Rutas de uploads (/api/upload)
router.use("/upload", uploadsRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

export default router;