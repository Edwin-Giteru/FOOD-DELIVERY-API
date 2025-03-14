import {Router } from 'express';
import * as restaurantController from '../controllers/restaurantController.js';

const restaurantRouter = Router();

restaurantRouter.post("/", restaurantController.addRestaurant);
restaurantRouter.get("/", restaurantController.getAllRestaurants);
restaurantRouter.get("/:id", restaurantController.getRestaurantById);
restaurantRouter.put("/:id", restaurantController.updateRestaurant);
restaurantRouter.delete("/:id", restaurantController.deleteRestaurant);
restaurantRouter.put("/:id", restaurantController.updateRestaurantMenu);
restaurantRouter.delete("/:id", restaurantController.deleteItemFromMenu);

export default restaurantRouter;