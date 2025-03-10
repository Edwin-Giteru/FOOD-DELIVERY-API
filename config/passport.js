import passport from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from "./env.js";
import User from "../models/users.model.js";
import {accessToken, refreshToken} from "../controllers/authController.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await User.findOne({ googleId: profile.id });
                if (user) {
                    return done(null, user);
                }
                const newUser = await User.create({ googleId: profile.id, name: profile.displayName });
                return done(null, newUser);
            } catch (error) {
                done(error);
            }
        }
    )
)