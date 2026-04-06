const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
});

// Apply auth middleware to all API routes
router.use(auth);

// GET /api/tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll({ 
            where: { userId: req.user.id },
            include: [{
                model: Comment,
                as: 'comments',
                include: [{ model: User, as: 'user', attributes: ['username'] }]
            }],
            order: [
                ['createdAt', 'DESC'],
                [{ model: Comment, as: 'comments' }, 'createdAt', 'ASC']
            ]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/tasks
router.post('/tasks', upload.single('image'), async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const task = await Task.create({ title, description, status, imageUrl, userId: req.user.id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/tasks/:id
router.put('/tasks/:id', upload.single('image'), async (req, res) => {
    try {
        const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!task) return res.status(404).json({ message: 'Tarea no encontrada.' });

        const updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        await task.update(updateData);
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/tasks/:id
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!task) return res.status(404).json({ message: 'Tarea no encontrada.' });

        await task.destroy();
        res.json({ message: 'Tarea eliminada con éxito.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/tasks/:taskId/comments
router.post('/tasks/:taskId/comments', async (req, res) => {
    try {
        const { text } = req.body;
        const comment = await Comment.create({
            text,
            taskId: req.params.taskId,
            userId: req.user.id
        });
        
        // Fetch the comment again to include the user info for the UI
        const fullComment = await Comment.findByPk(comment.id, {
            include: [{ model: User, as: 'user', attributes: ['username'] }]
        });
        
        res.status(201).json(fullComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
