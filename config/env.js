import { config } from "dotenv";

config(/*{ path: `.env.${process.env.NODE_ENV || 'development'}.local` }*/);

export const {
    PORT, 
    NODE_ENV, 
    DB_URI,
    JWT_SECRET_KEY,
    GOOGLE_OAUTH_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_ACCESS_TOKEN_URL,
    GOOGLE_TOKEN_INFO,
    GOOGLE_CALLBACK_URL,
    GOOGLE_OAUTH_SCOPES,
    REFRESH_TOKEN_KEY,
} = process.env;