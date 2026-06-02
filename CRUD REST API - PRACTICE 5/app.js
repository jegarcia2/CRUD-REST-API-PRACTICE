import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let dishes = [
    { id: 1, name: "Soup", price: 20.30 },
    { id: 2, name: "Rice", price: 15.99 },
    { id: 3, name: "Hamburguer", price: 10.00 },
];

let nextId = 4;
const routeName = "/dishes";

// READ ALL
app.get(routeName, (req, res) => {
    return res.status(200).json(dishes);
});

// CREATE
app.post(routeName, (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: "Name and Price are both required!" });
    }

    if (isNaN(Number(price))) {
        return res.status(400).json({ error: "Price must be a valid number!" });
    }

    const newDish = {
        id: nextId,
        name: String(name),
        price: Number(price),
    }

    dishes.push(newDish);

    nextId += 1;

    return res.status(201).json(newDish);
});

// READ ONE
app.get(`${routeName}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const dish = dishes.find((d) => d.id === id);
    if (!dish) {
        return res.status(404).json({ error: "dish not found" });
    }
    return res.status(200).json(dish);
});

// UPDATE
app.put(`${routeName}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const dish = dishes.find((d) => { return d.id === id });
    if (!dish) {
        return res.status(404).json({ error: "dish not found" });
    }
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: "Name and Price are both required!" });
    }

    if (isNaN(Number(price))) {
        return res.status(400).json({ error: "Price must be a valid number!" });
    }

    dish.name = name;
    dish.price = Number(price);

    return res.status(200).json(dish);
});

//DELETE
app.delete(`${routeName}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const dishIndex = dishes.findIndex((d) => { return d.id === id; });

    if (dishIndex === -1) {
        return res.status(404).json({ error: "Dish index not found" });
    }

    dishes.splice(dishIndex, 1);

    return res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`App listening in PORT: ${PORT}`)
})