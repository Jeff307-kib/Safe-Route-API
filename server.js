import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import app from "./app.js";

app.listen(process.env.PORT, async () => {
    console.log(`Server running on PORT: ${process.env.PORT}`);
}) 