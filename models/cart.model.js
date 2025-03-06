import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const cartSChema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    user_id: {
        type: String,
        required: true,
        ref: "User",
    },
    items: [{
        item_id: {
            type: String,
            required: true,
            ref: "Item",
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        }
    }],
    total_price: {
        type: Number,
        required: true,
        min: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});


const Cart = mongoose.model("Cart", cartSChema);
export default Cart;