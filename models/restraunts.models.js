import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const RestrauntsSChema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 200,
    },
    menu: {
        type: String,
        ref: "Menu",
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

const Restaurant = mongoose.model("Restaurant", RestrauntsSChema);
export default Restaurant;