import { startApp } from "./app.js";
import { createDatabase } from "./db.js";

const db = createDatabase();

const app = startApp(db);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`App is listening in port ${PORT}`);
});