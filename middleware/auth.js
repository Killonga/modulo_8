const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    let token;

    // Check for Authorization: Bearer [token] header
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        // Fallback to cookie for browser sessions
        token = req.cookies.token || authHeader; // authHeader here for cases where prefix is missing
    }

    if (!token) {
        return res.status(401).json({ message: 'No se encontró el token de autenticación. Acceso denegado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, email }
        next();
    } catch (error) {
        console.error('Error de autenticación:', error.message);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;
