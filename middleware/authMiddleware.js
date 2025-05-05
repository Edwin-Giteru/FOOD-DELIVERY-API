import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/env.js";
export const authorize = async (req, res, next) => {
    try {
        let token;

        // Check for Bearer token in Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        // Check for token in cookies if no Bearer token
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." });
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.user = decoded;

        next();
    } catch (error) {
        next(error);
        res.status(401).json({ message: "Invalid token." });
        return;
    }

};


