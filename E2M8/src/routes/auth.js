const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

const router = express.Router();

// Base de datos temporal 
const users = [];

// registrar usuario
// Esta ruta se encarga de recibir los datos de un nuevo usuario, encriptar su contraseña y darle acceso inicial.
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' })
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya esta registrado' })
        }

        // bcryp.hash se encarga de encriptar la contraseña para no guardarla en texto plano.
        // El número 10 es el "salt rounds", que define qué tan compleja/segura es la encriptación.
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword
        }

        users.push(newUser);

        // jwt.sign crea un "pase" (token) firmado usando nuestra llave secreta (JWT_SECRET)
        // El primer parametro { id: ..., email: ... } es el "payload" o datos que viajarán con el token
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({ message: 'Usuario registrado correctamente', user: { id: newUser.id, name: newUser.name, email: newUser.email }, token })
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' })
    }
})

// login usuario
// Esta ruta verifica si el correo y la clave coinciden, y luego le da un token JWT de acceso.
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password son requeridos' })
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: 'Credenciales invalidas' })
        }

        // bcrypt.compare verifica la contraseña ingresada en texto normal contra la contraseña encriptada (hash) que guardamos antes.
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Credenciales invalidas' })
        }

        // Generamos un nuevo token de sesión ya que las contraseñas coincidieron
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({ message: 'Login exitoso', user: { id: user.id, name: user.name, email: user.email }, token })
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesion' })
    }
}
)
module.exports = router;