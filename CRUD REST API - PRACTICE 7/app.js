import express from "express";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(customParseFormat);

const app = express();
const PORT = '3000';

app.use(express.json());

let tickets = [
    { id: 1, eventID: 1, seatNumber: 4, status: 1 },
    { id: 2, eventID: 1, seatNumber: 6, status: 1 },
    { id: 3, eventID: 2, seatNumber: 8, status: 2 },
];

let ticketsNextID = 4;

const events = [
    { id: 1, eventName: "Ed Sheeran", eventDate: "2026/06/10" },
    { id: 2, eventName: "Bad Bunny", eventDate: "2027/01/01" },
    { id: 3, eventName: "Olivia Rodrigo", eventDate: "2025/06/20" }
];

const statuses = [
    { id: 1, description: "Open" },
    { id: 2, description: "Closed" },
    { id: 3, description: "Pending" }
];

const existsIn = (table, id) => {
    return table.some((e) => { return e.id === id });
}

const seatTaken = (eventID, seatNumber) => {
    return tickets.some((t) => { return t.eventID === eventID && t.seatNumber === seatNumber });
}

// READ ALL
app.get("/tickets", (req, res) => {
    return res.status(200).json(tickets);
});

// CREATE
app.post("/tickets", (req, res) => {
    let { eventID, seatNumber, status } = req.body;
    if (!eventID || !seatNumber || !status) {
        return res.status(400).json({ error: "eventID, seatNumber and status are required!" })
    }
    seatNumber = Number(seatNumber);
    status = Number(status);
    eventID = Number(eventID);
    if (isNaN(eventID) || isNaN(seatNumber) || isNaN(status)) {
        return res.status(400).json({ error: "eventID, seatNumber and status must be numbers!" })
    }
    const event = events.find((e) => e.id === eventID);
    if (!event) {
        return res.status(400).json({ error: "Provided eventID does not exist!" });
    }
    if (dayjs(event.eventDate, "YYYY/MM/DD", true).isBefore(dayjs(), "day")) {
        return res.status(400).json({ error: "Cannot book tickets for a past event!" });
    }
    if (!existsIn(statuses, status)) {
        return res.status(400).json({ error: "Provided status does not exist!" })
    }
    if (seatTaken(eventID, seatNumber)) {
        return res.status(400).json({ error: "Provided seat is already taken!" })
    }

    const newTicket = {
        id: ticketsNextID,
        eventID,
        status,
        seatNumber,
    };

    tickets.push(newTicket);

    ticketsNextID += 1;

    return res.status(201).json(newTicket);
});

// READ ONE
app.get("/tickets/:id", (req, res) => {
    const id = Number(req.params.id);
    const ticket = tickets.find((t) => { return t.id === id });
    if (!ticket) {
        return res.status(404).json({ error: "Ticket with provided ID was not found!" })
    }
    return res.status(200).json(ticket);
});

// UPDATE
app.put("/tickets/:id", (req, res) => {
    const id = Number(req.params.id);
    const ticket = tickets.find((t) => { return t.id === id });
    if (!ticket) {
        return res.status(404).json({ error: "Ticket with provided ID was not found!" })
    }
    let { eventID, seatNumber, status } = req.body;
    if (!eventID || !seatNumber || !status) {
        return res.status(400).json({ error: "eventID, seatNumber and status are required!" })
    }
    seatNumber = Number(seatNumber);
    status = Number(status);
    eventID = Number(eventID);
    if (isNaN(eventID) || isNaN(seatNumber) || isNaN(status)) {
        return res.status(400).json({ error: "eventID, seatNumber and status must be numbers!" })
    }
    const event = events.find((e) => e.id === eventID);
    if (!event) {
        return res.status(400).json({ error: "Provided eventID does not exist!" });
    }
    if (dayjs(event.eventDate, "YYYY/MM/DD", true).isBefore(dayjs(), "day")) {
        return res.status(400).json({ error: "Cannot book tickets for a past event!" });
    }
    if (!existsIn(statuses, status)) {
        return res.status(400).json({ error: "Provided status does not exist!" })
    }
    if (seatTaken(eventID, seatNumber)) {
        return res.status(400).json({ error: "Provided seat is already taken!" })
    }

    ticket.eventID = eventID;
    ticket.seatNumber = seatNumber;
    ticket.status = status;

    return res.status(200).json(ticket);
});

// DELETE
app.delete("/tickets/:id", (req, res) => {
    const id = Number(req.params.id);
    const ticketIndex = tickets.findIndex((t) => { return t.id === id });

    if (ticketIndex === -1) {
        return res.status(404).json({ error: "Ticket index not found!" })
    }
    tickets.splice(ticketIndex, 1);

    return res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`App listening in port ${PORT}`);
});