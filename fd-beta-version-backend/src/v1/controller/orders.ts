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

    let ordersObj = new dborders();
    // Create order
    const orderData = {
      customer_id: req.user.id,
      restaurant_id: restaurant_id,
      totalamount: cartItems.totalamount,
      orderstatus: "pending",
    };
    const order = await ordersObj.insertRecord(orderData);
    if (!order) res.send(functionsObj.output(0, "FALIED_TO_CREATE_ORDER"));
    res.send(functionsObj.output(1, "ORDER_CREATED_SUCCESSFULLY"));

    let orderitemsObj = new dbOrderItems();

    // Add order items
    for (const item of cartItems.items) {
      let result = await orderitemsObj.insertRecord({
        order_id: order,
        food_item_id: item.food_item_id,
        quantity: item.quantity,
        price: item.price,
      });
      if (!result) res.send(functionsObj.output(0, "SOMETHING WENT WRONG"));
    }

    // Clear cart after placing the order
    cartitemsObj.uniqueField = cart_id;
    await cartitemsObj.deleteRecord(cart_id);

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
