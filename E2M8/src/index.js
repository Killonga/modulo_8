const express = require('express');
const app = express();
const PORT = 3000;
const tasksRouter = require('./routes/tasks');
app.use(express.json());




// Ruta pública de prueba para saber si la aplicación está "viva"
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: "API funcionando correctamente" });
});

// Importamos y exponemos las rutas públicas de autenticación (login y registro)
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Importamos el guardia (authMiddleware) y las rutas de tareas
// Al interponer authMiddleware, protegemos obligatoriamente TODAS las rutas de "/api/tasks"
// Cualquier petición sin un token válido será rechazada antes de llegar al tasksRouter. 
const authMiddleware = require('./middleware/auth');
app.use('/api/tasks', authMiddleware, tasksRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});