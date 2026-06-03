import { DatabaseSync } from "better-sqlite3";

export function createDB(location = "expenses.db") {
    const db = new DatabaseSync(location);

    db.exec(
        `
        CREATE TABLE IF NOT EXISTS expenses(
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            amount      REAL NOT NULL CHECK (amount > 0),
            category    TEXT NOT NULL CHECK (category IN ('travel','meals'. 'equipment', 'software', 'other')),
            description TEXT NOT NULL,
            status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            submittedAt TEXT NOT NULL
        )
        `
    );
    return db;
}