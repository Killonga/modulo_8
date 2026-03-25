import { Sequelize } from "sequelize";
import { config } from "./env.js";

/**
 * Sequelize instance for PostgreSQL database connection
 */
export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: config.nodeEnv === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

/**
 * Validate database connection
 */
export const validateConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida");
  } catch (error) {
    console.error("❌ No se pudo conectar con la base de datos:", error.message);
    process.exit(1);
  }
};