import User from "../models/users.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/env.js";


export const authorize = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

        if (!token) {
            return res.status(401).json({ error: "Unauthorized, token required" });
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ error: "Access denied, admin only" });
        }

        req.user = user; // Attach user data to request
        next(); // Proceed to the next middleware or route
    } catch (error) {
        res.status(401).json({ error: "Invalid token", message: error.message });
    }
};
