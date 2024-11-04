import express, { NextFunction } from "express";
import Joi from "joi";
import { filefunctions } from "../library/filefunctions";
import { functions } from "../library/functions";
import { validations } from "../library/validations";
import { dbcart } from "../model/dbcart";
import { dbCartItems } from "../model/dbcartitems";
function addToCartSchema(req: any, res: any, next: NextFunction): any {
  const schema = Joi.object({
    foodItemId: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().positive().required(),
  });

  const validationsObj = new validations();
  const isValid = validationsObj.validateRequest(req, res, next, schema);

  if (!isValid) {
    return false;
  }

  next();
}

const router = express.Router();
router.post("/add_to_cart", addToCartSchema, addItemToCart);
router.get("/fetch_cart", fetchCart);
router.delete("/remove_from_cart/:cartId/:foodItemId", removeItemFromCart);
module.exports = router;

async function addItemToCart(req: any, res: any): Promise<any> {
  const functionsObj = new functions();

  try {
    const { foodItemId, quantity, price } = req.body;


    const userId = req.user.id;

    const cartObj = new dbcart();
    let cart = await cartObj.getCartByUserId(userId);

    if (!cart) {
      cart = await cartObj.createCart(userId);
    }
    const cartitemsObj = new dbCartItems();
    const result = await cartitemsObj.addItemToCart(
      cart.id,
      foodItemId,
      quantity,
      price
    );
    if (result) {
      res.send(
        functionsObj.output(1, "Item added to cart successfully", result)
      );
    } else {
      res.send(functionsObj.output(0, "failed to add item to cart"));
    }
  } catch (error: any) {
    res.send(functionsObj.output(0, `internal server error, ${error.message}`));
  }
}

async function fetchCart(req: any, res: any): Promise<any> {
  const functionsObj = new functions();

  try {
    const userId = req.user.id;
    const cartObj = new dbcart();
    const cart = await cartObj.getCartByUserId(userId);

    if (!cart) {
      return res.send(functionsObj.output(0, "Cart not found."));
    }
    let cartitemsObj = new dbCartItems();
    const cartDetails = await cartitemsObj.getCartItemsWithTotal(cart.id);
    res.send(functionsObj.output(1, "Cart fetched successfully", cartDetails));
  } catch (error: any) {
    res.send(functionsObj.output(0, "Internal server error", error.message));
  }
}

async function removeItemFromCart(req: any, res: any): Promise<any> {
  const functionsObj = new functions();
  const { cartId, foodItemId } = req.params;

  try {
    const cartObj = new dbcart();
    const cartitemsObj = new dbCartItems();
    const result = await cartitemsObj.removeItemFromCart(cartId, foodItemId);

    if (!result) {
      return res.send(
        functionsObj.output(
          0,
          "Failed to remove item from cart or item not found."
        )
      );
    }

    res.send(
      functionsObj.output(1, "Item removed from cart successfully", result)
    );
  } catch (error: any) {
    res.send(functionsObj.output(0, "Internal server error", error.message));
  }
}
