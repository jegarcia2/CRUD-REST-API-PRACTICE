import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let members = [
    { id: 1, name: "Jose Garcia", tier: 1 },
    { id: 2, name: "Alex Torres", tier: 2 },
    { id: 3, name: "Marcos Marx", tier: 3 },
];

let memberNextId = 4;

let tiers = [
    { id: 1, description: "Golden" },
    { id: 2, description: "Silver" },
    { id: 3, description: "Bronze" }
];

// In case we want to CRUD the tiers too, for the sake of this practice I won't
let tiersNextId = 4;

const route = '/members'

// Read All
app.get(`${route}`, (req, res) => {
    return res.status(200).json(members);
});

// Create
app.post(`${route}`, (req, res) => {
    const { name, tier } = req.body;
    if (!name || tier === undefined) {
        return res.status(400).json({ error: "Name and tier are required!" });
    }
    if (isNaN(Number(tier))) {
        return res.status(400).json({ error: "Tier must be a number!" });
    }
    if (!tiers.some((t) => { return t.id === Number(tier) })) {
        return res.status(404).json({ error: "Given tier does not exist!" });
    }

    const newMember = {
        id: memberNextId,
        name,
        tier: Number(tier)
    };

    memberNextId += 1;

    members.push(newMember);

    return res.status(201).json(newMember);
});

// Read One
app.get(`${route}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const member = members.find((m) => { return m.id === id });
    if (!member) {
        return res.status(404).json({ error: "Member not found!" });
    }
    return res.status(200).json(member);
});

// Update
app.put(`${route}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const member = members.find((m) => { return m.id === id });
    if (!member) {
        return res.status(404).json({ error: "Member not found!" });
    }
    const { name, tier } = req.body;
    if (tier) {
        if (isNaN(Number(tier))) {
            return res.status(400).json({ error: "Tier must be a number!" });
        }
        if (!tiers.some((t) => { return t.id === Number(tier) })) {
            return res.status(404).json({ error: "Given tier does not exist!" });
        }
    }

    if (name !== undefined) member.name = name;
    if (tier !== undefined) member.tier = Number(tier);

    return res.status(200).json(member);
});

//Delete
app.delete(`${route}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const memberIndex = members.findIndex((m) => { return m.id === id });

    if (memberIndex === -1) {
        return res.status(404).json({ error: "Member index not found!" });
    }

    members.splice(memberIndex, 1);

    return res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`App listening in port: ${PORT}`)
})