const express = require('express');
const router = express.Router();

// Base de datos temporal 
let tasks = [
    { id: 1, title: 'EF-M8-2026', completed: false },
    { id: 2, title: '', completed: false }
];

let nextId = 3;

// obtener todas las tareas
router.get('/', (req, res) => {
    // req.user viene del middleware. Usamos su ID para que el usuario solo vea SUS propias tareas
    const userTasks = tasks.filter(t => t.userId === req.user.id);
    res.json(userTasks);
});

// obtener una tarea por id
router.get('/:id', (req, res) => {
    const userTasks = tasks.filter(t => t.userId === req.user.id);

    const task = userTasks.find(t => t.id === parseInt(req.params.id))
    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' })
    }

    res.json(task)
})

// crea una tarea (newTask). Como está protegida por el middleware 
// AUTH, automáticamente le asigna el ID del usuario que la crea. 
router.post('/', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'El titulo es requerido' })
    }

    const newTask = {
        title,
        completed: false,
        id: nextId++, //después de haberlo usado, aumenta en 1
        userId: req.user.id // Al guardar, vinculamos esta nueva tarea al ID del usuario que hizo la petición
    }

    tasks.push(newTask);
    res.status(201).json(newTask)
})

// actualizar tarea 
router.put('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id))

    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' })
    }

    const { title, completed } = req.body;

    if (title !== undefined) {
        task.title = title;
    }

    if (completed !== undefined) {
        task.completed = completed;
    }

    res.json(task)
})

// eliminar una tarea
router.delete('/:id', (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id))

    if (taskIndex === -1) {//-1 respuesta a no encontrado
        return res.status(404).json({ error: 'Tarea no encontrada' })
    }

    tasks.splice(taskIndex, 1);//elimina la tarea   
    res.status(204).send();//204 respuesta exitosa sin contenido
})

module.exports = router;