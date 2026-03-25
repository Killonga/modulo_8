import { config } from "../config/index.js";
import fs from "fs";
import path from "path";

/**
 * Subir avatar de usuario
 * @route POST /api/upload/avatar/:userId
 */
export const subirAvatar = async (req, res, next) => {
  try {
    // Verificar que se recibió un archivo
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        ok: false,
        message: "No se procesó ningún archivo",
      });
    }

    const avatar = req.files.avatar;
    const { userId } = req.params;

    // Validar extensión del archivo
    const fileName = avatar.name;
    const extension = fileName.split(".").pop().toLowerCase();

    if (!config.uploads.allowedExtensions.includes(extension)) {
      return res.status(400).json({
        ok: false,
        message: `Extensión de archivo no permitida. Permitidas: ${config.uploads.allowedExtensions.join(", ")}`,
      });
    }

    // Crear directorio si no existe
    const uploadPath = path.join(process.cwd(), config.uploads.avatarsPath);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Ruta de destino
    const destinationPath = path.join(uploadPath, `${userId}.${extension}`);

    // Mover el archivo
    await new Promise((resolve, reject) => {
      avatar.mv(destinationPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.status(200).json({
      ok: true,
      message: "Avatar subido exitosamente",
      data: {
        userId,
        fileName: `${userId}.${extension}`,
        extension,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  subirAvatar,
};