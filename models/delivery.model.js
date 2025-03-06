import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const deliverySchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    delivery_person_id: {
        type: String,
        required: true,
        ref: "User",
    },
    order_id: {
        type: String,
        required: true,
        ref: "Order",
    },
    delivery_status: {
        type: String,
        enum: ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending',
    },
    delivery_address: {
        type: String,
        required: true,
    },
    delivery_time: {
        type: Date,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;