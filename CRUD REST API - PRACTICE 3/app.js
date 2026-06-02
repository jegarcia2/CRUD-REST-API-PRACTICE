import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
    { id: 1, title: "My first title", completed: true },
    { id: 2, title: "My second title", completed: true },
];
let nextId = 3;

//READ ALL
app.get('/tasks', (req, res) => {
    return res.status(200).json(tasks);
});

//CREATE
app.post('/tasks', (req, res) => {
    const { title, completed } = req.body;
    if (!title) {
        return res.status(404).json({ error: 'Title is required!' });
    }

    const newTask = { id: nextId, title: title, completed: completed ?? false }
    tasks.push(newTask);
    return res.status(201).json(newTask);
});

//READ ONE
app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => { return t.id === id });
    if (!task) {
        return res.status(404).json({ error: "Task was not found" });
    }

    return res.status(200).json(task);
});

//UPDATE
app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => { return t.id === id });

    const { title, completed } = req.body;

    if (!task) {
        return res.status(404).json({ error: "Task was not found" });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    return res.status(200).json(task);

});

//DELETE
app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const taskIndex = tasks.findIndex((t) => { return t.id === id });

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(taskIndex, 1);
    return res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`App listening in port ${PORT}`)
})