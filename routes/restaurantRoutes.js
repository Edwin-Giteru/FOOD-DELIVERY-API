import {Router } from 'express';
import * as restaurantController from '../controllers/restaurantController.js';

const restaurantRouter = Router();

restaurantRouter.post("/", restaurantController.addRestaurant);
restaurantRouter.get("/", restaurantController.getAllRestaurants);
restaurantRouter.get("/:id", restaurantController.getRestaurantById);
restaurantRouter.put("/:id", restaurantController.updateRestaurant);
restaurantRouter.delete("/:id", restaurantController.deleteRestaurant);
restaurantRouter.patch("/:id/menu", restaurantController.updateRestaurantMenu);
restaurantRouter.delete("/:id/menu", restaurantController.deleteItemFromMenu);
restaurantRouter.post("/:id/menu", restaurantController.addMenuToRestaurant);
restaurantRouter.get("/:id/all", restaurantController.RestaurantMenu);

export default restaurantRouter;