const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Este middleware funciona como un "guardia de seguridad". Se ejecuta antes de dejar
// pasar al usuario a rutas protegidas (como crear o ver tareas).
const authMiddleware = (req, res, next) => {

    // 1. Buscamos el token en la cabecera 'Authorization' de la petición.
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Token de autenticacion requerido o no se proporciono' })
    }

    // 2. Por estándar, el token se envía en formato "Bearer <token_letras_y_num>"
    // Dividimos por el espacio para revisar si el formato es correcto.
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Formato de token invalido' })
    }

    // 3. Extrayendo la segunda parte, que es el token real
    const token = parts[1];

    try {
        // 4. Se asegura de que el token es legítimo usando jwt.verify y nuestra contraseña secreta.
        // Si el token es falso o expiró, esta línea dará error y pasará directamente al "catch".
        const decoded = jwt.verify(token, JWT_SECRET);

        // 5. Si todo sale bien, inyectamos la información del usuario (id, email) en req.user
        // Esto permite que las rutas siguientes (ej: /tasks) sepan quién es el dueño de la petición.
        req.user = decoded;

        // 6. next() es como abrirle la puerta. Significa "Todo correcto, puedes pasar a la siguiente función".
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token de autenticacion invalido' })
    }
}

module.exports = authMiddleware;