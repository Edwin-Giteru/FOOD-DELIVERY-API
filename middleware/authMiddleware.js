import User from "../models/users.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/env";

const authorize = async (req, res, next) => {
    try{
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({ error: "Token is required" });
        }
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
     
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
        }
        req.user = user;
        next()
   
    } catch (error) {
        res.status(401).json({ message : "Invalid token",  error: error.message  });
    }
} 
export default authorize;