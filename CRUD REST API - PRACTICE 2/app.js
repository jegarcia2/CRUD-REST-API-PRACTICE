import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
    { id: 1, title: "First Title", completed: true },
    { id: 2, title: "SEcond Title", completed: false }
];

let taskId = 3;

//CREATE
app.post("/tasks", (req, res) => {
    const { title, completed } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const newTask = { id: taskId, title, completed: completed ?? false };
    taskId += 1;
    tasks.push(newTask);
    return res.status(201).json(newTask);
});

// READ
// READ ONE
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => {
        return t.id === id
    });

    if (!task) {
        return res.status(400).json({ error: "Task was not found" });
    }

    return res.status(200).json(task);
});

// READ ALL
app.get("/tasks", (req, res) => {
    res.send(tasks);
});

//UPDATE
app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, completed } = req.body;
    const task = tasks.find((t) => {
        return t.id === id
    });
    if (!task) {
        return res.status(400).json({ error: "Task was not found" });
    }

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    return res.status(201).json(task);
});


//DELETE
app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const taskIndex = tasks.findIndex((t) => { return t.id === id });

    if (taskIndex === -1) {
        return res.status(400).json({ error: "Task was not found" });
    }

    tasks.splice(taskIndex, 1);

    return res.status(200).json({ success: "Delete succesfully" });;

});

app.listen(PORT, () => {
    console.log(`App listening in port: ${PORT}`)
});

