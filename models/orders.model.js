import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const orderSchema = new mongoose.Schema({
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
    restaurant_id: {
        type: String,
        required: true,
        ref: "Restaurant",
    },
    items: [{
        item_menu_id: {
            type: String,
            required: true,
            ref: "Menu"
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        }
    }],
    order_status: {
        type: String,
        enum: ['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled'],
        default: 'pending',
    },
    total_price: {
        type: Number,
        required: true,
        min: 0,
    },
    payment_status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});
const Order = mongoose.model("Order", orderSchema);
export default Order;