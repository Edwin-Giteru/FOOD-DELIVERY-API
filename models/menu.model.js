import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
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