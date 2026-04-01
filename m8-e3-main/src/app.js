import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { sequelize } from "./config/sequelize.js";
import rutasAuth from "./routes/auth.routes.js";
import rutasUsuario from "./routes/usuario.routes.js";

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(rutasAuth);
app.use(rutasUsuario);
app.use(express.static("public"));

async function main() {
  try {
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error", error);
  }
}

main();
