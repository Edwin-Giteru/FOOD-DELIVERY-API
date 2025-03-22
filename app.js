import express from "express";
import cookieParser from "cookie-parser";
import { PORT, JWT_SECRET_KEY } from "./config/env.js";
import ToDatabase from "./database/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import session from "express-session";
import passport from "passport";

const app = express();

app.use(
    session({
        secret: JWT_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set secure to false for development environment
        name: "session", // Name of the cookie
        httpOnly: true, // Cookie will only be sent over HTTP, not over HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie will expire after 7 days
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/restaurants", restaurantRouter);


app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    await ToDatabase();
});

export default app;