import { createApp } from "./app";
import { createDB } from "./db";

const db = createDB();
const app = createApp(db);
const PORT = process.env.PORT || 3000;

app.list(PORT, () => {
    console.log(`Expense tracker API listening on ${PORT}`);
})