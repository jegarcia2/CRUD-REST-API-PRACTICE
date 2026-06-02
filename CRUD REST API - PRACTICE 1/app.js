import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
    { id: 1, title: "test", completed: false },
    { id: 2, title: "second title", completed: true }
];
let nextId = 3;

const findTaskByID = (id) => {
    const task = tasks.find((t) => { return t.id === id });
    return task;
}

//CREATE ONE
app.post("/tasks", (req, res) => {
    const { title, completed } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newTask = { id: nextId++, title, completed: completed ?? false };
    tasks.push(task);
    return res.status(201).json(newTask);
});

//READ
//READ ALL
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

//READ ONE
app.get("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const task = findTaskByID(id);
    if (!task) {
        return res.status(404).json({ error: "id not found!" })
    }

    return res.status(200).json(task)
});

//UPDATE
app.put("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const task = findTaskByID(id);
    const { title, completed } = req.body;
    if (!task) {
        return res.status(404).json({ error: "id not found!" })
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    return res.status(200).json(task);

});

//DELETE
app.delete("/tasks/:id:", (req, res) => {
    const id = Number(req.params.id);
    const taskIndex = tasks.findIndex((t) => {
        return t.id === id
    });

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" })
    }

    tasks.splice(taskIndex, 1);

    return res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server started in port: ${PORT}`)
});