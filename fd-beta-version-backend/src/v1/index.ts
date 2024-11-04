import express from "express";
import Joi from "joi";
import { validations } from "./library/validations";
import jwt from "jsonwebtoken";
import { functions } from "./library/functions";

let openAccessApi: string[] = ["/users/signup", "/users/login"];

const router = express.Router();

router.use(checkAccess);


async function checkAccess(req: any, res: any, next: any): Promise<any> {
  // Logic to check access
  let functionsObj = new functions();
  try {
    if (openAccessApi.includes(req.path)) {
      console.log(req.path);
      next();
    } else {
      const token = req.headers.authorization;
      if (!token) {
        res.send(functionsObj.output(0, "Authorization token missing"));
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;

      console.log("req.user", req.user);

      next();
    }
  } catch (err: any) {
    res.send(functionsObj.output(0, "Invalid token"));
    return;
  }
}

/*
 *  Controllers (route handlers)
 */

let usersRouter = require("./controller/users");
let restaurantsRouter = require("./controller/restaurants");
let cartRouter = require("./controller/cart");
let ordersRouter = require("./controller/orders");
let paymentsRouter = require("./controller/payments");
let ratingsRouter = require("./controller/ratings");

/*
 * Primary app routes.
 */
router.use("/users", usersRouter);
router.use("/restaurants/online_orders", restaurantsRouter);
router.use("/food_items/online_orders", cartRouter);
router.use("/orders/online_orders", ordersRouter);

router.use("/payments/online_orders", paymentsRouter);
router.use("/ratings/online_orders", ratingsRouter);

module.exports = router;
