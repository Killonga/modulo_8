const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Handlebars Setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Context Middleware (to provide user to templates)
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = user;
        } catch (err) {
            res.clearCookie('token');
        }
    }
    next();
});

// Views Routes
app.get('/', (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/board');
    }
    res.render('home');
});
app.get('/login', (req, res) => res.redirect('/#hero'));
app.get('/register', (req, res) => res.redirect('/#hero'));
app.get('/board', (req, res) => {
    if (!req.cookies.token) {
        return res.redirect('/');
    }
    res.render('board', { isBoard: true });
});

// Auth & API Routes
app.use('/', authRoutes);
app.use('/api', apiRoutes);

// Database Sync & Start Server
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }) // Update schema without losing data
    .then(() => {
        console.log('✅ Base de datos conectada y sincronizada.');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error al conectar la base de datos:', err);
    });
