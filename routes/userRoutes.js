import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authorize } from '../middleware/authMiddleware.js';

const userRouter = Router();

userRouter.post("/create-admin", userController.createAdmin);
userRouter.get("/", authorize, userController.getAllUsers);
userRouter.get("/:id", authorize, userController.getUserById);

export default userRouter;