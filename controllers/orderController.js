import Menu from "../models/menu.model.js";
import Order from "../models/orders.model.js";
import Restaurant from "../models/restraunts.models.js";


export const placeOrder = async (req, res, next) => {
    try{
        const { menu_id, restaurant_id, user_id, quantity} = req.body;
        const foodItem = await Menu.findById(menu_id);
        const restaurant = await Restaurant.findById(restaurant_id);
        

        if (foodItem in restaurant.menu) {
          if (restaurant.menu[foodItem].quantity >= quantity) {
            const newOrder = await Order.create({
                user_id,
                restaurant_id,
                items: [{ item_menu_id: menu_id, quantity }],
                total_price: foodItem.price * quantity,
            });
            await restaurant.save();
            return res.status(201).json({ success: true, data: newOrder });

          }}
    } catch (error) {
        next(error);
    }
}

export const getAllOrders = async (req, res, next) => {
    try{
        const orders = await Order.find({});
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
}

export const  getOrderById = async (req, res, next) => {
    try{ 
        const order_id = req.params.id;
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
}

export const updateOrderStatus = async (req, res, next) => {
    try{
        const order_id = req.params.id;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(order_id, { order_status: status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
}

export const deleteOrder = async (req, res, next) => {
    try{
        const order_id = req.params.id;
        const order = await Order.findByIdAndDelete(order_id, { new: true});
        if (!order) {
            res.satust(404).json({success: false, message: "Order not found"});
            return;
        }
        res.status(200).json({ success: true, message: "Order deleted successfully"})
    } catch (error) {
        next(error);
    }
}

export const getOrderHistory = async (req, res, next) => {
    try{
        const user_id = req.params.id;
        const orders = await Order.find({ user_id });
        if (!orders) {
            return res.status(404).json({ success: false, message: "No orders found for this user" });
        } 
        
        res.status(200).json({ success: true, data: orders });
        
    }catch (error) {
        next(error);
    }
}
