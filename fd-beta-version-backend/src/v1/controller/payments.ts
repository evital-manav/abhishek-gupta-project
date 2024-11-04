import express, { Request, Response } from "express";
import { dborders } from "../model/dborders";
import { dbPayments } from "../model/dbpayments";
import { dbDeliveries } from "../model/dbdeliveries";
import { dbusers } from "../model/dbusers";
import { validations } from "../library/validations";
import { functions } from "../library/functions";
import Joi from "joi";

const validationsObj = new validations();
const functionsObj = new functions();
export function paymentSchema(req: Request, res: Response, next: any): any {
  const schema = Joi.object({
    orderId: Joi.number().required(),
    paymentMethod: Joi.string().required(),
  });

  const validationsObj = new validations();

  const isValid = validationsObj.validateRequest(req, res, next, schema);

  if (!isValid) {
    return false;
  }

  next();
}

const router = express.Router();

router.post("/make_payment", createPayment);

module.exports = router;

async function createPayment(req: any, res: Response): Promise<any> {
  try {
    const { orderId, paymentMethod } = req.body;
    console.log("req.body of create Payment", req.body);

    // Fetch the total amount for the order
    const orderObj = new dborders();
    let user_id = req.user.id;
    const totalAmount = await orderObj.getTotalForOrderId(user_id, orderId);

    // Insert payment record
    const paymentsObj = new dbPayments();
    const paymentDetails = await paymentsObj.insertRecord({
      orderId,
      paymentMethod,
      totalAmount,
    });
    // Fetch a delivery person ID
    const deliveryObj = new dbDeliveries();
    const usersObj = new dbusers();
    usersObj.where = `WHERE userType = 'delivery_person'`;

    const result = await usersObj.allRecords();
    if (!result || result.length === 0) {
      throw new Error("No delivery person found.");
    }
    let deliveryPersonId = result[0].id;
    // Create the delivery record
    const deliveryDetails = await deliveryObj.createDelivery(
      orderId,
      deliveryPersonId
    );

    // Return success response
    res.send(
      functionsObj.output(
        1,
        "Payment is being processed, delivery partner will be assigned soon.",
        {
          paymentDetails,
          deliveryDetails,
        }
      )
    );
  } catch (error: any) {
    console.log("Error processing payment:", error);
    res.send(functionsObj.output(0, "Failed to process payment."));
  }
}

const paymentController = {
  createPayment,
};

export default paymentController;
