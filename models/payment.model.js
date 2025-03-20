import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        ref: "Order",
    },
    user_id: {
        type: String,
        required: true,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    payment_status: {
        type: String,
        enum: ['pending', 'failed', 'succeeded'],
        default: 'unpaid',
    },
    payment_method: {
        type: String,
        enum: ['mpesa', 'card'],
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});
const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;