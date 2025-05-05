import Restaurant from "../models/restraunts.models.js";
import mongoose from "mongoose";
import Menu from "../models/menu.model.js";

// creating a new restaurant should be role based, only admin can create a restaurant

export const addRestaurant = async (req, res, next) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try{
        const { name, phone_number, address} = req.body;
        const existingRestaurant = await Restaurant.findOne({ name: name, address: address});
        if (existingRestaurant) {
            const error = new Error("Restaurant already exists");
            error.statusCode = 409;
            throw error;
        }
        const newRestaurant = await Restaurant.create({ 
            name: name, 
            phone_number: phone_number,
            address: address});

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
        const restaurant_id = req.params.id;
        const restaurant = await Restaurant.findById(restaurant_id).populate("menu");

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        return res.status(200).json({ success: true, data: restaurant.menu });
    } catch (error) {
        console.error("🔥 Error fetching menu:", error);
        next(error);
    }
};


// export const updateRestaurantMenu = async (req, res, next) => {
//     try {
//         const {menu} = req.body;
//         const restaurant_id = req.params.id; 
        
//         if (!Array.isArray(menu)) {
//             return res.status(400).json({ error: "Menu must be an array" });
//         }
        
//         const validMenuItem = [];
//         for (const itemId of menu) {
//             // Check if itemId is a valid MongoDB ObjectId
//             if (!mongoose.Types.ObjectId.isValid(itemId)) {
//                 return res.status(400).json({ error: `Invalid menu item ID: ${itemId}` });
//             } 
//             const MenuItem = await Menu.findById(itemId);
//             if (MenuItem) {
//                 validMenuItem.push(MenuItem);
//             }          
//         }   
//         if (validMenuItem.length < 0) {
//             return res.status(400).json({ error: "No valid menu items found" });
//         }
//         const restaurant = await Restaurant.findByIdAndUpdate(restaurant_id, {menu: menu}, {new: true}).populate("menu");

//         if (!restaurant) {
//             res.status(404).json({error: "Restaurant not found"})
//         };     
//         return res.status(200).json({success: true, data: "Menu updated successfully"});
       
//     } catch (error) {
//         next(error);
//     }
// }

export const updateRestaurantMenu = async (req, res, next) => {
    try {
        const { menu } = req.body; // Expecting an array of menu objects
        const restaurant_id = req.params.id;

        if (!Array.isArray(menu)) {
            return res.status(400).json({ error: "Menu must be an array of objects" });
        }

        // Validate each menu item
        let validMenuItems = [];
        for (const item of menu) {
            const { name, description, price, image_url } = item;

            if (!name || name.length < 3 || name.length > 100) {
                return res.status(400).json({ error: "Each menu item must have a valid name between (3-100 characters)" });
            }
            if (!description || description.length < 10 || description.length > 500) {
                return res.status(400).json({ error: "Each menu item must have a valid description between (10-500 characters)" });
            }
            if (typeof price !== "number" || price < 0) {
                return res.status(400).json({ error: "Each menu item must have a valid price (non-negative number)" });
            }

            validMenuItems.push({
                name,
                description,
                price,
                image_url,
            });
        }

        // Find the menu for the restaurant
        let menuDocument = await Menu.findOne({ restaurant_id });

        if (!menuDocument) {
            // If no menu exists for the restaurant, create a new one
            menuDocument = new Menu({
                restaurant_id,
                menu_items: validMenuItems,
            });
        } else {
            // Update the existing menu
            menuDocument.menu_items = validMenuItems;
        }

        // Save the menu document
        await menuDocument.save();

        return res.status(200).json({ success: true, data: menuDocument });
    } catch (error) {
        next(error);
    }
};

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


export const addMenuToRestaurant = async (req, res) => {
    try{
        const restaurant_id = req.params.id;
        const { name, price, description, image_url } = req.body;
        if (!mongoose.Types.ObjectId.isValid(restaurant_id)) {
            return res.status(400).json({ success: false, message: "Invalid Restaurant Id" });
        }
        const restaurant = await Restaurant.findById(restaurant_id);
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        const menuItem = await Menu.create({
            restaurant_id: restaurant_id,
            name,
            price,
            description,
            image_url,
        });

        restaurant.menu.push(menuItem._id);
        await restaurant.save();
        return res.status(201).json({ success: true, data: menuItem , message: "Menu added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}
