import express, { Request, Response } from "express";
import { dbRatings } from "../model/dbratings";
import { validations } from "../library/validations";
import Joi from "joi";
import { functions } from "../library/functions";

const functionsObj = new functions();

export function createRatingSchema(
  req: Request,
  res: Response,
  next: any
): any {
  const schema = Joi.object({
    restaurantId: Joi.number().required(),
    rating: Joi.number().min(1).max(5).required(),
  });

  const validationsObj = new validations();
  const isValid = validationsObj.validateRequest(req, res, next, schema);

  if (!isValid) {
    return false;
  }

  next();
}

const router = express.Router();

router.post("/add_rating", createRating);

module.exports = router;

async function createRating(req: any, res: any): Promise<any> {
  const { restaurantId, rating } = req.body;

  try {
    let ratingsObj = new dbRatings();
    let user_id = req.user.id;
    const newRating = await ratingsObj.insertRating(
      restaurantId,
      rating,
      user_id
    );
    return res.send(
      functionsObj.output(1, "Rating added successfully", newRating)
    );
  } catch (error: any) {
    
    return res.send(
      functionsObj.output(0, "Rating couldn't be added due to some issues")
    );
  }
}
