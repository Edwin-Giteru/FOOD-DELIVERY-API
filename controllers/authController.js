import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {  JWT_SECRET_KEY, REFRESH_TOKEN_KEY,/* GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET*/ } from '../config/env.js';
import jwt from "jsonwebtoken";
import User from '../models/users.model.js';
// import axios from "axios";


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
        // console.log("password before hashing", password);
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
 
    
} */export const RefreshToken = async (req, res, next) => {
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
    
// export const GoogleAuth = (req, res) => {
//     const redirectUri = "http://localhost:5000/auth/google/callback";  // Must match Google Cloud Console
//     const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&access_type=offline`;
//     res.redirect(authUrl);
// }
// export const GoogleCallback = async (req, res) => {
//     try {
//         const { code } = req.query;
//         if (!code) {
//             return res.status(400).json({ error: "Authorization code not found" });
//         }

//         // Exchange authorization code for access token
//         const { data } = await axios.post("https://oauth2.googleapis.com/token", {
//             client_id: GOOGLE_CLIENT_ID,
//             client_secret: GOOGLE_CLIENT_SECRET,
//             redirect_uri: "http://localhost:5000/auth/google/callback",
//             grant_type: "authorization_code",
//             code
//         }, { headers: {"Content-Type": "application/x-www-form-urlencoded"}});

//         const { access_token, id_token } = data;

//         // Decode Google User Info
//         const googleUser = jwt.decode(id_token);
//         if (!googleUser) {
//             return res.status(400).json({ error: "Invalid Google token" });
//         }

//         // Check if User Exists
//         let user = await User.findOne({ email: googleUser.email });

//         if (!user) {
//             user = await User.create({
//                 name: googleUser.name,
//                 email: googleUser.email,
//                 password: "google-auth",  // Placeholder password
//                 phone_number: "0000000000", // Default phone number
//                 refresh_token: access_token
//             });
//         }

//         // Generate JWT Access Token
//         const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: "1h" });

//         res.status(200).json({
//             success: true,
//             data: {
//                 accessToken: jwtToken,
//                 user
//             }
//         });

//     } catch (error) {
//         console.error("Google OAuth Error:", error);
//         if (!res.headerSent) {
//             return res.status(500).json({ error: "Internal Server Error" });
//         }
//     }
// };