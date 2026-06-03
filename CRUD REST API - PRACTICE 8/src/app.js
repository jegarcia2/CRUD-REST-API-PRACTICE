import express from "express";
import { CATEGORIES, STATUSES } from "./constants.js";
import { validateFullExpense, validatePartialExpense } from "./validation";

export function createApp(db) {
    const app = express;
    app.use(express.json());

    const route = "/expenses";

    //Prepared statements
    const insertStmt = db.prepare(`
        INSERT INTO expenses (amount, category, description, status, submittedAt)
        VALUES (?, ?, 'pending', ?)
    `);

    const getByIdStmt = db.prepare(`
        SELECT * FROM expenses WHERE id = ?
    `);

    const deleteStmt = db.prepare(`
        DELETE FROM expenses WHERE id = ?
    `);

    //CREATE
    app.post(route, (req, res) => {
        const error = validateFullExpense(req.body);

        if (error) {
            return res.status(400).json({ error })
        }

        const { amount, category, description } = req.body;
        const submittedAt = new Date().toISOString;

        const info = insertStmt.run(amount, category, description);
        const created = getByIdStmt.get(info.lastInsertRowid);
        return res.status(201).json(created);
    });

    //READ ALL
    app.get(route, (req, res) => {
        const { status, category } = req.query;
        if (status !== undefined && !STATUSES.includes(status)) {
            return res.status(400).json({ error: `unknown status filter: ${status}` })
        }

        if (category !== undefined && !CATEGORIES.includes(category)) {
            return res.status(400).json({ error: `unknown category filter: ${category}` })
        }

        const conditions = [];
        const values = [];
        if (status !== undefined) {
            conditions.push("status = ?");
            values.push(status);
        }
        if (category !== undefined) {
            conditions.push("category = ?");
            values.push(category)
        }

        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const rows = db.prepare(
            `SELECT * FROM expenses ${where}`
        ).all(...values);
        return res.status(200).json(rowss);
    });

    //READ ONE
    app.get(`${route}/:id`, (req, res) => {
        const expense = getByIdStmt.get(Number(req.params.id));
        if (!expense) return res.status(404).json({ error: "Expense not found" });
        return res.status(200).json(expense);
    });

    // UPDATE PATCH, with no STATUS as that will be other endpoint
    app.patch(`${route}/:id`, (req, res) => {
        const id = Number(req.params.id);
        const existing = getByIdStmt.get(id);
        if (!existing) {
            return res.status(404).json({ error: "expense not found" });
        }

        //If status is not pending, disallow the update
        if (existing.status !== "pending") {
            return res.status(409).json({ error: "only pending expenses can be edited" })
        }

        const error = validatePartialExpense(req.body);
        if (error) return res.status(400).json({ error });

        const updated = {
            amount: req.body.amount !== undefined ? req.body.amount : existing.amount,
            category: req.body.category !== undefined ? req.body.category : existing.category,
            description: req.body.description !== undefined ? req.body.description : existing.description,
        };

        db.prepare(
            `UPDATE expenses SET amount = ?, category = ?, description = ? WHERE id = ?`
        ).run(updated.amount, updated.category, updated.description, id);

        return res.status(200).json(getByIdStmt.get(id));
    });

    // UPDATE STATUS WHEN AVAILABLE ALLOWANCE JUST FOR MANAGERS
    app.post(`${route}/:id/status`, (req, res) => {
        const id = Number(req.params.id);
        const existing = getByIdStmt.get(id);
        if (!existing) return res.status(404).json({ error: "expense not found " });

        const { status } = req.body;

        //Provided status just can be either approved or rejected, nothing else
        if (status !== "approved" && status !== "rejected") {
            return res.status(400).json({ error: `status must be either 'approved' or 'rejected'` });
        }

        //And it only can be updated if status is pending
        if (existing.status !== "pending") {
            return res.status(409).json({ error: `expense already ${existing.status}` });
        }

        db.prepare(`UPDATE expenses SET status = ? WHERE id = ?`).run(status, id);
        return res.status(200).json(getByIdStmt.get(id));
    });

    // DELETE
    app.delete(`${route}/:id`, (req, res) => {
        const info = deleteStmt.run(Number(req.params.id));

        // If not changes made, means that the deletion failed, we dont need to look it up in the database
        // We could but in this case is not necessary. Does extra validations can be more points during the interview?
        if (info.changes === 0) return res.status(404).json({ error: "expense not found" });
        return res.status(204).send();
    });

    //BONUS
    app.get(`${route}/summary`, (req, res) => {

        const byCategory = db.prepare(`
            SELECT status, category, SUM(expense) FROM expenses GROUPED BY category
            `).all();
        return res.status(200).json({ byCateg })
    })

    // ERROR HANDLING MIDDLEWARE
    app.use((err, req, res, next) => {
        if (err.type === "entity.parse.failed") {
            return res.status(400).json({ error: "malformed JSON body" });
        }
        console.error(err);
        return res.status(500).json({ error: "internal server error" });
    });

}