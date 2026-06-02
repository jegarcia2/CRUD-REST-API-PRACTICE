import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let patients = [
    { id: 1, firstName: "Gabriel", lastName: "Tester", hospitalized: true },
    { id: 2, firstName: "Alfonso", lastName: "Middle", hospitalized: true },
    { id: 3, firstName: "John", lastName: "Young", hospitalized: false },
];

let nextId = 4;

//READ WITH FILTERING
app.get("/patients", (req, res) => {
    const { firstName, lastName, hospitalized } = req.query;
    const result = patients.filter((p) => {
        if (firstName && p.firstName !== firstName) return false;
        if (lastName && p.lastName !== lastName) return false;
        if (hospitalized && String(p.hospitalized) !== hospitalized) return false;
        return true;
    });

    return res.status(200).json(result);
});

//CREATE
app.post("/patients", (req, res) => {
    const { firstName, lastName, hospitalized } = req.body;
    if (!firstName || !lastName) {
        return res.status(400).json({ error: "Both first and last name are required!" })
    }

    const newPatient = {
        id: nextId,
        firstName,
        lastName,
        hospitalized: hospitalized ?? false,
    }

    patients.push(newPatient);

    nextId += 1;

    return res.status(201).send(newPatient);
});

//READ ONE BY ID
app.get("/patients/:id", (req, res) => {
    const id = Number(req.params.id);
    const patient = patients.find((p) => p.id === id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    return res.status(200).json(patient);
});

//UPDATE
app.put("/patients/:id", (req, res) => {
    const id = Number(req.params.id);
    const { firstName, lastName, hospitalized } = req.body;
    const patient = patients.find((p) => p.id === id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    if (firstName !== undefined) patient.firstName = firstName;
    if (lastName !== undefined) patient.lastName = lastName;
    if (hospitalized !== undefined) patient.hospitalized = hospitalized;
    return res.status(200).json(patient);
});

//DELETE
app.delete("/patients/:id", (req, res) => {
    const id = Number(req.params.id);
    const patientIndex = patients.findIndex((p) => {
        return p.id === id
    });

    if (patientIndex === -1) {
        return res.status(404).json({ error: "Patient Index not found" });
    }

    patients.splice(patientIndex, 1);

    return res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`App listening in PORT: ${PORT}`)
});