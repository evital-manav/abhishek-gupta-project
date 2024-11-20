import express, { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { filefunctions } from "../library/filefunctions";
import { functions } from "../library/functions";
import { validations } from "../library/validations";
import { dbRestaurantMenu } from "../model/dbrestaurantmenu";
import { dbRestaurant } from "../model/dbrestaurants";

let validationsObj = new validations();
let functionsObj = new functions();

const router = express.Router();
router.post("/list", getAllRestaurants);
router.post("/menu/list", restaurantMenuSchema, getRestaurantMenu);
router.post("/add_restaurant/", createRestaurantSchema, createRestaurant);
module.exports = router;

function createRestaurantSchema(req: any, res: any, next: NextFunction): any {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(10).max(500).required(),
    phone: Joi.string().required(),
  });

  let isValid = validationsObj.validateRequest(req, res, next, schema);

  if (!isValid) {
    return false;
  }

  next();
}

async function createRestaurant(req: any, res: any): Promise<any> {
  const functionsObj = new functions();

  try {
    let restaurantObj = new dbRestaurant();
    if (req.user.userType === "restaurant_owner") {
      const newRestaurant = await restaurantObj.insertRecord({
        ...req.body,
        owner_id: req.user.id,
      });
      if (!newRestaurant)
        res.send(functionsObj.output(0, "FAILED_TO_ADD_RESTAURANT"));
      res.send(
        functionsObj.output(1, "Restaurant created successfully", newRestaurant)
      );
      return false;
    } else {
      res.send(
        functionsObj.output(
          0,
          "Sorry only the restaurant_owners are authorized to add restaurant"
        )
      );
      return false;
    }
  } catch (error: any) {
    res.send(functionsObj.output(0, error.message));
    return false;
  }
}

async function getAllRestaurants(req: any, res: any): Promise<any> {
  var functionsObj = new functions();

  const { name } = req.query;

  try {
    let restaurantObj = new dbRestaurant();

    let restaurants = await restaurantObj.getAllRestaurants(name);

    res.send(
      functionsObj.output(1, "Restaurants fetched successfully", restaurants)
    );
    return false;
  } catch (err: any) {
    res.send(functionsObj.output(0, err.message));
    return false;
  }
}

function restaurantMenuSchema(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const schema = Joi.object({
    restaurant_id: Joi.number().greater(0).required().messages({
      "number.greater": "restaurant_id must be greater than 0",
      "any.required": "restaurant_id is required",
      "number.base": "restaurant_id must be a number",
    }),
  });

  const validationsObj = new validations();
  const isValid = validationsObj.validateRequest(req, res, next, schema);

  if (!isValid) {
    return false;
  }

  next();
}
async function getRestaurantMenu(req: any, res: any) {
  const { restaurant_id } = req.body;

  try {
    const restaurantmenuObj = new dbRestaurantMenu();

    const menuWithItems = await restaurantmenuObj.getMenuWithFoodItems(
      restaurant_id
    );

    if (!menuWithItems) {
      return res.send(
        functionsObj.output(0, "Menu not found for this restaurant")
      );
    }

    return res.send(
      functionsObj.output(1, "Menu fetched successfully", menuWithItems)
    );
  } catch (error: any) {
    return res.send(
      functionsObj.output(0, "Internal server error", error.message)
    );
  }
}
