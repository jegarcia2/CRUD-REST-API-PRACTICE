import { createDatabase } from "./db";
import { createApp } from "./app";

const db = createDatabase();
const app = createApp(db);
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API listening on ${PORT}`)
});
