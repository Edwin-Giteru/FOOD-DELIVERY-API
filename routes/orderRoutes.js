import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';

const orderRouter = Router();

orderRouter.post("/", orderController.placeOrder);
orderRouter.get("/", orderController.getAllOrders);
orderRouter.get("/:id", orderController.getOrderById);
orderRouter.put("/:id/status", orderController.updateOrderStatus);
orderRouter.delete("/:id", orderController.deleteOrder);
orderRouter.get("/history/:id", orderController.getOrderHistory);

export default orderRouter;