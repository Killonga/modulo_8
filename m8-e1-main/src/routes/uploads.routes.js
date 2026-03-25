import express from "express";
import { subirAvatar } from "../controllers/uploads.controller.js";
import { idSchema } from "../schemas/common.schemas.js";
import { validarParams } from "../middlewares/validar.js";

const router = express.Router();

/**
 * @route POST /api/upload/avatar/:userId
 * @description Subir avatar de usuario
 * @access Public
 */
router.post(
  "/avatar/:userId",
  validarParams(idSchema),
  subirAvatar
);

export default router;