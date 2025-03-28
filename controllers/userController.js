import User from "../models/users.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * NAME
 * EMAIL
 * PASSWORD
 * PHONE_NUMBER
 * ROLE
 *  */

export const createAdmin = async (req, res, next) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        const { email, password, phone_number, role } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = await User.create([{
            email,
            password: hashedPassword,
            phone_number,
            role
        }], { session });
        await session.commitTransaction();
    }catch (error) {
        next(error);
    }
}
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    try{
        const user_id = req.params.id;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({error : "User not found"});
        }
        return res.status(200).json({success: true, data: user});
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const user_id = req.params.id;
        const user = await User.findByIdAndDelete(user_id);
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        return res.status(200).json({success: true, message: "User deleted successfully"});
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
     try{
        const { name, email, password, phone_number, role } = req.body;
        const user_id = req.params.id;
        const user = await User.findByIdAndUpdate(user_id, { name, email, password, phone_number, role }, { new: true });
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        return res.status(200).json({success: true, data: user});
     } catch (error) {
        next(error);
     }
}
