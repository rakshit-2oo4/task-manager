const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [
    { id: uuidv4(), title: 'Learn React', description: 'Complete React tutorial', completed: false },
    { id: uuidv4(), title: 'Build API', description: 'Create backend API with Express', completed: true },
];

// GET /tasks - Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const newTask = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        completed: false,
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    res.json(tasks[taskIndex]);
});

// DELETE /tasks/:id - Remove a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    tasks = tasks.filter(task => task.id !== taskId);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});