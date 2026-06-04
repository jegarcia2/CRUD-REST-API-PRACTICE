import express from "express";
import { validationShortenedURL, validationPartialShortenedURL } from "./validation.js";

export function startApp(db) {
    const app = express();

    app.use(express.json());

    const route = '/shortener';

    const selectByIDStmt = db.prepare(
        `SELECT * FROM shortenedURL WHERE id = ?`
    );

    const createStmt = db.prepare(
        `INSERT INTO shortenedURL 
        (originalURL, shortenedCode)
        VALUES
        (?, ?)
        `
    );

    const deleteStmt = db.prepare(
        `DELETE FROM shortenedURL WHERE id = ?`
    );

    const checkByShortenedCode = db.prepare(
        `SELECT COUNT(*) as isCodeInDB FROM shortenedURL where shortenedCode = ?`
    );

    //Creation
    app.post(route, (req, res) => {
        const error = validationShortenedURL(req.body);

        if (error) {
            return res.status(400).json(error);
        }

        const { originalURL } = req.body;

        let { shortenedCode } = req.body;

        if (!shortenedCode) {
            //TODO limit the uuid being provided
            shortenedCode = new uuid();
        }

        const isAlreadyCreated = checkByShortenedCode.get(shortenedCode);

        if (isAlreadyCreated.isCodeInDB != 0) {
            return res.status(409).json({ error: "The provided shortened code already exists!" });
        }

        const info = createStmt.run(originalURL, shortenedCode);
        const created = selectByIDStmt.get(info.lastInsertRowid);

        return res.status(201).json(created);
    });

    //Read all
    app.get(route, (req, res) => {
        const shortenedURLs = db.prepare(
            `SELECT * FROM shortenedURL`
        ).all();

        return res.status(200).json(shortenedURLs);
    });

    //Read One
    app.get(`${route}/:id`, (req, res) => {
        const id = Number(req.params.id);
        const info = selectByIDStmt.get(id);
        if (!info) {
            return res.status(404).json({ error: "The provided ID do not match the database" });
        }
        return res.status(200).json(info)
    });

    // Update put
    app.put(`${route}/:id`, (req, res) => {
        const error = validationShortenedURL(req.body);
        if (error) {
            return res.status(400).json(error);
        }

        const id = Number(req.params.id);
        const info = selectByIDStmt.get(id);
        if (!info) {
            return res.status(404).json({ error: "The provided ID do not match the database" });
        }

        const { originalURL } = req.body;

        let { shortenedCode } = req.body;

        if (!shortenedCode) {
            //TODO limit the uuid being provided
            shortenedCode = new uuid();
        }

        const isAlreadyCreated = checkByShortenedCode.get(shortenedCode);

        if (isAlreadyCreated.isCodeInDB != 0) {
            return res.status(409).json({ error: "The provided shortened code already exists!" });
        }

        const updatedInfo = db.prepare(`
            UPDATE (originalURL, shortenedCode) shortenedURL VALUES(?, ?) 
            `).run(originalURL, shortenedCode)

        const updated = selectByIDStmt.get(updatedInfo.id);

        return res.status(200).json(updated);
    });

    // update patch
    app.patch(`${route}/:id`, (req, res) => {
        const error = validationPartialShortenedURL(req.body);
        if (error) {
            return res.status(400).json(error);
        }
        const id = Number(req.params.id);
        const info = selectByIDStmt.get(id);
        if (!info) {
            return res.status(404).json({ error: "The provided ID do not match the database" });
        }

        const param = [];
        const values = [];

        if (originalURL !== undefined) {
            param.push('originalURL');
            values.push(originalURL);
        };
        if (shortenedCode !== undefined) {
            const isAlreadyCreated = checkByShortenedCode.get(shortenedCode);
            if (isAlreadyCreated.isCodeInDB != 0) {
                return res.status(409).json({ error: "The provided shortened code already exists!" });
            }
            param.push('shortenedCode')
            values.push(shortenedCode)
        }

        const updatedInfo = db.prepare(`
            UPDATE (${param.concat(', ')}) shortenedURL VALUES(${values.concat(', ')}) 
            `).run();

        const updated = selectByIDStmt.get(updatedInfo.id);
        return res.status(200).json(updated);

    });

    // Delete
    app.delete(`${route}/:id`, (req, res) => {
        const id = Number(req.params.id);
        const info = selectByIDStmt.get(id);
        if (!info) {
            return res.status(404).json({ error: "The provided ID do not match the database" });
        }
        const deletion = deleteStmt.run(id);
        return res.status(200).json({ success: "The row was deleted successfully" })
    });

    app.use((err, req, res, next) => {

    });

    return app;
}