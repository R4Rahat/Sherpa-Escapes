import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import { seedAdmin } from "./src/config/seedAdmin.js";

await connectDB();
await seedAdmin();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});