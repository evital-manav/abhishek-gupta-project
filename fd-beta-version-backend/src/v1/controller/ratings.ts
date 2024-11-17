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
    restaurantId: Joi.number().required().greater(0),
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

  let ratingsObj = new dbRatings();
  let user_id = req.user.id;
  const ratingData = {
    restaurant_id: restaurantId,
    rating: rating,
    user_id: user_id,
  };
  const newRating = await ratingsObj.insertRecord(ratingData);
  if (!newRating) res.send(functionsObj.output, "FAILED_TO_ADD_RATING");
  res.send(functionsObj.output(1, "Rating added successfully", newRating));
  return;
}
