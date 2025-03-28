import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import passport from "passport";

const authRouter = Router();

authRouter.post('/signup', authController.SignUp);
authRouter.post('/signin', authController.SignIn);
authRouter.post('/token', authController.RefreshToken);


authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));



// Handle Google OAuth callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: req.user,
    });
  }
);

// Logout
authRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ success: true, message: "Logged out successfully" });
  });
});


export default authRouter;