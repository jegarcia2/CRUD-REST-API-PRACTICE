import Database from "better-sqlite3";

export function createDatabase(location = "habits.db") {
    const db = new Database(location);

    db.pragma("foreign_keys = ON");

    db.exec(
        `
        CREATE TABLE IF NOT EXISTS habits(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL CHECK(LENGTH(name) < 51),
            frequency TEXT NOT NULL CHECK(frequency IN ("daily", "weekly", "monthly")),
            difficulty TEXT NOT NULL CHECK(difficulty IN ("easy", "medium", "hard")),
            creationDate TEXT DEFAULT CURRENT_TIMESTAMP
        )
        `
    );

    db.exec(
        `
        CREATE TABLE IF NOT EXISTS completions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habitID INTEGER NOT NULL,
        completionDate TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (habitID) REFERENCES habits(id)
        )
        `
    )

    return db;
}