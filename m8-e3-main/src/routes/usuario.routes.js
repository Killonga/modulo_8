import { Router } from "express";
import { perfilUsuario } from "../controllers/usuario.controllers.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = Router();

// router.get("/perfil", verificarToken, perfilUsuario);

export default router;
