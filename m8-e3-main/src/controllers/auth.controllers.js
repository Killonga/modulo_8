import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";

// Profe
// su.munozh@gmail.com

const SECRET = process.env.SECRET;

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await Usuario.findOne({ where: { username } });

    if (userExists) {
      return res.status(409).json({ error: "El usuario ya existe en sistema" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Usuario.create({
      username,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "Usuario creado", user: newUser.username });
  } catch (error) {
    return res.status(500).json({ error: "Server internal error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usuario.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Credenciales invalidad" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const payload = {
      id: user.id,
      username: user.username,
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    // return res.json({ token });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // true en producción (https)
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hora
      })
      .json({ mensaje: "Login exitoso" });
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
};
