import express, { NextFunction } from "express";
import Joi from "joi";
import { filefunctions } from "../library/filefunctions";
import { functions } from "../library/functions";
import { validations } from "../library/validations";
import { dbRestaurantMenu } from "../model/dbrestaurantmenu";
import { dbRestaurant } from "../model/dbrestaurants";
const router = express.Router();

function createRestaurantSchema(req: any, res: any, next: NextFunction): any {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(10).max(500).required(),
    phone: Joi.string().required(),
  });

  const validationsObj = new validations();
  const isValid = validationsObj.validateRequest(req, res, next, schema);

  if (!isValid) {
    return false;
  }

  next();
}

router.get("/list", getAllRestaurants);
router.get("/:id/menu/list", getRestaurantMenu);
router.post("/add_restaurant/", createRestaurantSchema, createRestaurant);
router.get("/search_restaurants_by_name", searchRestaurantByName);
module.exports = router;

async function createRestaurant(req: any, res: any): Promise<any> {
  const functionsObj = new functions();

  try {
    let restaurantObj = new dbRestaurant();
    if (req.user.userType === "restaurant_owner") {
      const newRestaurant = await restaurantObj.insertRestaurant({
        ...req.body,
        owner_id: req.user.id,
      });

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

  try {
    let restaurantObj = new dbRestaurant();
    const restaurants = await restaurantObj.getAllRestaurants();

    res.send(
      functionsObj.output(1, "Restaurants fetched successfully", restaurants)
    );
    return false;
  } catch (err: any) {
    res.send(functionsObj.output(0, err.message));
    return false;
  }
}

async function getRestaurantMenu(req: any, res: any) {
  const { id } = req.params;
  const functionsObj = new functions();

  try {
    console.log("restaurant_id", id);

    const restaurantmenuObj = new dbRestaurantMenu();

    let restaurant_id = parseInt(id);
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

async function searchRestaurantByName(req: any, res: any): Promise<any> {
  const { name } = req.query;
  const functionsObj = new functions();

  console.log("restaurant_name", name);

  if (!name) {
    res.send(functionsObj.output(0, "Restaurant name is required"));
    return false;
  }

  try {
    const restaurantObj = new dbRestaurant();
    const restaurants = await restaurantObj.searchByName(name);

    if (restaurants.length === 0) {
      res.send(functionsObj.output(0, "No restaurant found with this name"));
      return false;
    }

    res.send(
      functionsObj.output(1, "Restaurants fetched successfully", restaurants)
    );
  } catch (error) {
    res.send(functionsObj.output(0, "Internal server error", error));
  }
}
