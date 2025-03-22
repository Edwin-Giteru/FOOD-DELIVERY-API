import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/signup', authController.SignUp);
authRouter.post('/signin', authController.SignIn);
authRouter.post('/token', authController.RefreshToken);
authRouter.get("/google", authController.GoogleAuth);
authRouter.get("/google/callback", authController.GoogleCallback)

export default authRouter;