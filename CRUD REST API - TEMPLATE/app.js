import express from "express";

const app = express();
const PORT = 3000;

//Parses json into req.body
app.use(express.json());

let tasks = [
    { id: 1, title: "Learn Express", completed: false },
    { id: 2, title: "Second element", completed: false }
];
let nextId = 3;

//READ ALL
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

//READ ONE
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => {
        return t.id === id
    });

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
});

//CREATE
app.post("/tasks", (req, res) => {
    const { title, completed } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Title is required!"
        });
    }

    const newTask = {
        id: nextId++,
        title,
        completed: completed ?? false, //Default if not provided
    }

    tasks.push(newTask);
    return res.status(201).json(newTask);
});

//UPDATE
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => {
        return t.id === id
    });

    if (!task) {
        return res.status(404).json({ error: "Task to update not found" });
    }

    const { title, completed } = req.body;
    // Only update fields that were actually sent.
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    return res.json(task);
});

//DELETE
app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const taskIndex = tasks.findIndex((t) => {
        return t.id === id
    });
    console.log(taskIndex)

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" })
    }

    tasks.splice(taskIndex, 1);

    return res.status(204).send();
});

//This runs the app
app.listen(PORT, () => {
    console.log(`Runnning on ${PORT}`);
});



