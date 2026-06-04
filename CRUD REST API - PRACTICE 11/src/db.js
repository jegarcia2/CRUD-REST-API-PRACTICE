import Database from "better-sqlite3";

export function createDatabase(location = "shortener.db") {
    const db = new Database(location);

    db.exec(
        `
        CREATE TABLE IF NOT EXISTS shortenedURL(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        originalURL TEXT NOT NULL,
        shortenedCode TEXT NOT NULL,
        clicks INTEGER DEFAULT 0
        )
        `
    )

    return db;
}