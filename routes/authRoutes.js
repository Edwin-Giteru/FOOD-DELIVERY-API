import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/signup', authController.SignUp);
authRouter.post('/signin', authController.SignIn);

export default authRouter;