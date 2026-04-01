import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET;

export function verificarToken(req, res, next) {
  // const authHeader = req.headers.authorization;

  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res.status(403).json({ error: "Token requerido" });
  // }
  // const token = authHeader.split(" ")[1];
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ error: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    req.usuario = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ error: "Token invalido o expirado" });
  }
}
