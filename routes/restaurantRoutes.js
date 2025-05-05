import {Router } from 'express';
import * as restaurantController from '../controllers/restaurantController.js';
import { authorize } from '../middleware/authMiddleware.js';

const restaurantRouter = Router();

restaurantRouter.post("/",authorize, restaurantController.addRestaurant);
restaurantRouter.get("/", authorize,restaurantController.getAllRestaurants);
restaurantRouter.get("/:id", authorize,restaurantController.getRestaurantById);
restaurantRouter.put("/:id", authorize, restaurantController.updateRestaurant);
restaurantRouter.delete("/:id", authorize, restaurantController.deleteRestaurant);
restaurantRouter.patch("/:id/menu", authorize, restaurantController.updateRestaurantMenu);
restaurantRouter.delete("/:id/menu",authorize, restaurantController.deleteItemFromMenu);
restaurantRouter.post("/:id/menu", authorize, restaurantController.addMenuToRestaurant);
restaurantRouter.get("/:id/all", authorize, restaurantController.RestaurantMenu);

export default restaurantRouter;