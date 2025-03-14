import Restaurant from "../models/restraunts.models.js";
import mongoose from "mongoose";

export const addRestaurant = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const { name, phone_number, address} = req.body;
        const existingRestaurant = await Restaurant.findOne({ name: name, phone_number: phone_number, address: address});
        if (existingRestaurant) {
            const error = new Error("Restaurant already exists");
            error.statusCode = 409;
            throw error;
        }
        const newRestaurant = await new Restaurant.create({ name: name, phone_number: phone_number, address: address});
        res.status(201).json({
            success: true,
            data: newRestaurant
        });
        await session.commitTransaction();
        session.endSession();

    }catch (error) {
        session.abortTransaction();
        session.endSession();
        next(error);
    }

}

export const getAllRestaurants = async (req, res, next) => {
    try{
        const restaurant = await Restaurant.find({});
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
}

export const RestaurantMenu = async (req, res, next) => {
    try {
        const menu = req.body
        const restaurant_id = req.params.id;
        const  restaurant = await Restaurant.findById(restaurant_id, {menu: menu});
        if (!restaurant) {
            res.status(404).json({error: 'Not Found'});
        }
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
}

export const updateRestaurantMenu = async (req, res, next) => {
    try {
        const menu = req.body;
        const restaurant_id = req.params.id;
        const restaurant = await Restaurant.findByIdAndUpdate(restaurant_id, {menu: menu}, {new: true});
        if (!restaurant) {
            res.status(404).json({error: "Restaurant not  Found"})
        }
        res.status(200).json({success: true, data: restaurant});
    } catch (error) {
        next(error);
    }
}

export const deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant_id = req.params.id;
        const restaurant = await Restaurant.findByIdAndDelete(restaurant_id);
        if (!restaurant) {
            res.status(404).json({error: "Restaurant not found"})
        }
        res.status(200).json({success: true, message: "Restaurant deleted successfully"});
    } catch (error) {
        next(error);
    }
}

export const deleteItemFromMenu = async (req, res, next) => {
    try{
        const restraunt_id = req.params.id;
        const menu_id = req.params.menuId;
        const restaurant = await Restaurant.findByIdAndUpdate(restraunt_id, { $pull: { menu: { _id: menu_id } } }, {new: true});
        if (!restaurant) {
            res.status(404).json({error: "Restaurant not found"})
        }
        res.status(200).json({ success: true, data: restaurant });
               
    } catch (err) {
        next(err);
    }
}


export const getRestaurantById = async (req, res, next) => {
    try{ 
        const restraunt_id = req.params.id;
        const restaurant = await Restaurant.findById(restraunt_id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
}

export const updateRestaurant = async (req, res, next) => {
    try{
        const restraunt_id = req.params.id;
        const { name, phone_number, address } = req.body;
        const restaurant = await Restaurant.findByIdAndUpdate(restraunt_id, { name, phone_number, address }, { new: true });
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
}


export const addItemToMenu = async (req, res, next) => {
    try{
        const restraunt_id = req.params.id;
        const { name, price, description } = req.body;
        const restaurant = await Restaurant.findByIdAndUpdate(restraunt_id, { $push: { menu: { name, price, description } } }, { new: true });
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        next(error);
    }
}
