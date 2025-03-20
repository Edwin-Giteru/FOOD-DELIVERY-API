import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
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
    menu: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
    }
    ],
    created_at: {
        type: Date,
        default: Date.now,
    }
});

const Restraunt = mongoose.model("Restaurant", RestaurantSchema);
export default Restraunt;