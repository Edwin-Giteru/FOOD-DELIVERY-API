import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";
if(!DB_URI) {
    throw new Error("DB_URI not defined in environment variables");
}
const ToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);

        console.log(`Connected to database in ${NODE_ENV} mode.`);
    } catch (error) {
        console.error("Error conneccting to database:", error);
    }
};

export default ToDatabase;