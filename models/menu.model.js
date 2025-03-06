import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const MenuSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    restraunt_id: {
        type: String,
        required: true,
        ref: "Restaurant",
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image_url: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});
const Menu = mongoose.model("Menu", MenuSchema);
export  default Menu;