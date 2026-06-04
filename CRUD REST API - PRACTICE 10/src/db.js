import Database from "better-sqlite3";

export function createDatabase(location) {
    const db = new Database();

    db.pragma("foreign_keys = ON");

    db.exec(
        `
        CREATE TABLE IF NOT EXISTS projects(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'active' CHECK(status IN ('active', 'archived', 'completed')),
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
        `
    );

    db.exec(
        `
        CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        priority TEXT DEFAULT 'todo' CHECK(priority IN ('todo', 'in_progress', 'done')),
        status TEXT NOT NULL CHECK(status IN ('active', 'archived', 'completed')),
        dependsOnTaskID INTEGRER DEFAULT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY dependsOnTaskID REFERENCES projects(id)
        )
        `
    );

    return db;
}