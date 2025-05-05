import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true,
        minLength:3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    //validate number to start with 254
    phone_number: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /^254\d{9}$/.test(v);
            },
            message: props => `${props.value} should start with 254!`
        },
        unique: true,   
    },
    role: {
        type: String,
        enum: ['admin', 'customer', "rider"],
        default: 'customer',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    refresh_token: {
        type: String,
    },
});
const User = mongoose.model("User", UserSchema);
export default User;