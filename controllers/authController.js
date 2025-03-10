import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {  JWT_SECRET_KEY, REFRESH_TOKEN_KEY } from '../config/env.js';
import jwt from "jsonwebtoken";
import User from '../models/users.model.js';


export const SignUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password, phone_number } = req.body
        const existingUser = await User.findOne({where : { email: email,  phone_number: phone_number}});
        if (existingUser) {
            const error = new Error(" User already exists");
            error.statusCode = 409;
            throw error;
        }
        // Check if password exists
        if (!password || !email) {
            return res.status(400).json({error: " Email and password required"});
        }
        const salt = await bcrypt.genSalt(10);
        console.log("password before hashing", password);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser =  await User.create([{name, email, phone_number, password: hashedPassword}], {session});
      
        const accessToken = jwt.sign({ userId: newUser._id }, JWT_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ userId: newUser._id }, REFRESH_TOKEN_KEY, { expiresIn: "7d" });

        newUser[0].refresh_token = refreshToken;
        await newUser[0].save();
        await session.commitTransaction()
        res.status(201).json({
            success: true,
            data: {
                accessToken,
                refreshToken,
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
        const user = await User.findOne({email});

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 400;
            throw error
        }
        if (!password) {
            res.status(400).json({error: "Password is required"});
        }
        // if (!user.password) {
        //     res.status(400).json({error: "User.password is not found"})
        //}
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const error = new Error("Invalid Credentials");
            error.statusCode = 401;
            throw error;
        }
        const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_KEY, { expiresIn: "7d" });

        user.refresh_token = refreshToken;
        await user.save();
        res.status(201).json({
            success: true,
            data: {
                accessToken,
                refreshToken,
                user
            }
        })
    } catch (error) {
        next(error);
    }
}
/* export const SignOut = async (req, res, next) => {
 
    
} */
    export const RefreshToken = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
    
            if (!refreshToken) {
                return res.status(403).json({ error: "Refresh Token is required" });
            }
    
            // Find user with refresh token
            const user = await User.findOne({ refreshToken });
            if (!user) {
                return res.status(403).json({ error: "Invalid Refresh Token" });
            }
    
            // Verify refresh token
            jwt.verify(refreshToken, REFRESH_TOKEN_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ error: "Invalid Refresh Token" });
                }
    
                // Generate new access token
                const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET_KEY, { expiresIn: "1h" });
    
                res.status(200).json({
                    success: true,
                    data: {
                        accessToken: newAccessToken
                    }
                });
            });
    
        } catch (error) {
            next(error);
        }
    };
    