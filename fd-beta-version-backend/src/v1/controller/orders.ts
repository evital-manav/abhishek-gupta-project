import express from "express";
import { Request, Response, NextFunction } from "express";
import { dborders } from "../model/dborders";
import { dbcart } from "../model/dbcart";
import { functions } from "../library/functions";
import { validations } from "../library/validations";
import { dbOrderItems } from "../model/dborderitems";
import { dbCartItems } from "../model/dbcartitems";


const functionsObj = new functions();

const router = express.Router();

router.post("/place_order", createOrder);
router.get("/fetch_orders", fetchOrders);

module.exports = router;

async function createOrder(req: any, res: Response) {
  const { restaurant_id, cart_id } = req.query;


  try {
    console.log("restaurantId and cartId", restaurant_id, cart_id);

    // Fetch cart items and total amount
    let cartObj = new dbcart();
    let cartitemsObj = new dbCartItems();
    const cartItems = await cartitemsObj.getCartItemsWithTotal(cart_id);
    console.log("cartItems.items", cartItems.items);
    let ordersObj = new dborders();
    // Create order
    const order = await ordersObj.createOrder(
      req.user.id,
      restaurant_id,
      cartItems.totalamount
    );
 

    let orderitemsObj = new dbOrderItems();

    // Add order items
    for (const item of cartItems.items) {
      await orderitemsObj.addOrderItem(
        order,
        item.food_item_id,
        item.quantity,
        item.price
      );
    }

    // Clear cart after placing the order
    await cartitemsObj.clearCart(cart_id);

    res.send(
      functionsObj.output(1, "Order placed successfully", {
        orderId: order,
      })
    );
  } catch (error: any) {
    res.send(functionsObj.output(0, "Failed to place order"));
  }
}

async function fetchOrders(req: any, res: Response) {
  try {

    let ordersObj = new dborders();
    // Get order details for the user
    let user_id = req.user.id;
    const orderDetails = await ordersObj.getOrderDetails(user_id);

    if (orderDetails) {
      res.send(
        functionsObj.output(1, "Orders fetched successfully", orderDetails)
      );
    } else {
      res.send(functionsObj.output(0, "Orders not found"));
    }
  } catch (error: any) {
   
    res.send(functionsObj.output(0, "Internal server error"));
  }
}
