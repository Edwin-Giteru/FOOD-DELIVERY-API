import passport from "passport";
import{ Strategy as GoogleStrategy} from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from "./env.js";
import User from "../models/users.model.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
        
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                
                let user = await User.findOne({ googleId: profile.id });
                const phone_number = Math.random() * 10;
                
                if (!user) {              
                    user = await User.create({ 
                        googleId: profile.id,
                        name: profile.displayName, 
                        email: profile.emails[0].value, 
                        avatar: profile.photos[0].value,
                        password: "google-auth", 
                        phone_number: phone_number, 
                        refresh_token: refreshToken

                    });

                    await user.save();
                    
                }
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try{
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;