import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {  JWT_SECRET_KEY } from '../config/env.js';
import jwt from "jsonwebtoken";
import User from '../models/users.model.js';


export const SignUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body
        const existingUser = User.findOne({email});
        if (existingUser) {
            const error = new Error(" User already exists");
            error.statusCode = 409;
            throw error;
        }
        // Check if password exists
        if (!password){
            return res.status(400).json({error: "password required"});
        }
        const salt = bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);
        const newUser = User.create([{name, email, password: hashedPassword}], {session});

        const token = jwt.sign({userId: newUser[0]._id, JWT_SECRET_KEY});
        await session.commitTransaction()
        res.status(201).json({
            success: true,
            data: {
                token,
                user: newUser[0]
            }
        });


    } catch (error) {
        session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const SignIn = async (req, res, next) => {
    try{
        const { email, password } = req.body 
        const user = User.findOne({email}).select('+password');

        if (!user) {
            const error = new Error("User not found");
            error.statusCode(400);
            throw error
        }
        if (!password) {
            res.status(400).json({error: "Password is required"});
        }
        if (!user.password) {
            res.status(400).json({error: "User.password is not found"})
        }
        const isValidPassword = bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const error = new Error("Invalid Credentials");
            error.statusCode(401);
            throw error;
        }
        const token = jwt.sign({userId: user._id, JWT_SECRET_KEY, expiresIn: '1h' });
        res.status(201).json({
            success: true,
            data: {
                token,
                user
            }
        })
    } catch (error) {
        next(error);
    }
}
/* export const SignOut = async (req, res, next) => {
 
    
} */
