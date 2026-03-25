/**
 * Server Entry Point
 * Inicia el servidor HTTP y conecta a la base de datos
 */

import app from "./app.js";
import { config, validateConnection } from "./config/index.js";

/**
 * Iniciar el servidor
 */
const startServer = async () => {
  try {
    // Validar conexión a la base de datos
    await validateConnection();

    // Iniciar el servidor
    app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🏆 Servidor corriendo exitosamente              ║
║                                                   ║
║   📍 URL: http://localhost:${config.port}              ║
║   📚 Swagger: http://localhost:${config.port}/docs      ║
║   🔧 Entorno: ${config.nodeEnv}                          ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Manejo de señales de terminación graceful
process.on("SIGTERM", async () => {
  console.log("🔴 Señal SIGTERM recibida. Cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🔴 Señal SIGINT recibida. Cerrando servidor...");
  process.exit(0);
});

// Iniciar el servidor
startServer();