import express from "express";
import { FREQUENCY, DIFFICULTY } from "./constants";
import { validateCompletion, validateHabits, validateHabitsPartial } from "./validation";

export function createApp(db) {
    const app = express();
    app.use(express.json());

    const route = "/habits";

    //Prepared statements
    const insertStmtHabits = db.prepare(`
        INSERT INTO habits 
        (name, frequency, difficulty)
        VALUES
        (?, ?, ?)
    `);

    const getByIdStmtHabits = db.prepare(`
        SELECT * FROM habits WHERE id = ?
        `);

    const deleteStmtHabits = db.prepare(`
        DELETE FROM habits WHERE id = ?
    `);

    const insertStmtCompletion = db.prepare(`
        INSERT INTO completions
        (habitID)
        VALUES
        (?)
    `);

    const getByIdStmtCompletion = db.prepare(`
        SELECT * FROM completion WHERE id = ?
        `);

    const deleteStmtCompletion = db.prepare(`
        DELETE FROM completion WHERE id = ?
    `);

    //CREATE
    app.post(route, (req, res) => {
        const error = validateCompletion(req.body);

        if (error) {
            return res.status(400).json(validation);
        }

        
    })

    return app;
}