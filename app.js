import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import ToDatabase from "./database/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/auth", authRouter);

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    await ToDatabase();
});

export default app;