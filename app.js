import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    await connectToDatabase();
});

export default app;