import { error } from "console";
import { appdb } from "./appdb"; // Import the base class
import { dbcart } from "./dbcart";
export class dbCartItems extends appdb {
  constructor() {
    super();
    this.table = "cartitems";
    this.uniqueField = "id";
  }

  async getCartItemsWithTotal(cartId: number | string) {
    // Define fields to select
    const fields = `
      fi.item_name,
      ci.food_item_id,
      ci.quantity,
      ci.price,
      (ci.price * ci.quantity) AS total_price
    `;

    // Set the table for the join query
    this.table = `
      cartitems ci
      JOIN fooditems fi ON ci.food_item_id = fi.id
    `;

    this.where = `WHERE ci.cart_id = ${cartId}`;
    this.orderby = "";

    let results = await this.allRecords(fields);
    results = results ? results.rows : [];
    // Calculate the total amount
    let totalAmount = results.rows
      .reduce((sum: number, item: any) => sum + parseFloat(item.total_price), 0)
      .toFixed(2);

    // Return the items and total amount
    return { items: results.rows, totalamount: totalAmount };
  }

  async addItemToCart(
    cartId: number,
    foodItemId: number,
    quantity: number,
    price: number
  ) {
    let return_results = {
      error: true,
      message: "something_went_wrong",
      results: {},
    };

    this.where = `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`;

    const existingItemResult = await this.allRecords();

    if (existingItemResult && existingItemResult.length > 0) {
      const existingItem = existingItemResult[0];
      const newQuantity =
        Number(existingItem.quantity) +
        (typeof quantity === "string" ? parseInt(quantity) : quantity);

      let updatedQuantity = await this.update(
        "cartitems",
        { quantity: newQuantity },
        `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`
      );
      if (!updatedQuantity) return return_results;
      let data = {
        ...existingItem,
        quantity: newQuantity,
      };

      return {
        ...return_results,
        error: false,
        message: "quantity_updated_successfully",
        results: data,
      };
    } else {
      const result = await this.insertRecord({
        cart_id: cartId,
        food_item_id: foodItemId,
        quantity: quantity,
        price: price,
      });
      if (!result)
        return { ...return_results, message: "item_could_not_added" };
      return {
        ...return_results,
        error: false,
        message: "Item_added_successfully",
      };
    }
  }
  async removeItemFromCart(cartId: number, foodItemId: number, userId: number) {
    let return_results = {
      error: true,
      message: "",
      results: {},
    };
    const cartObj = new dbcart();
    cartObj.where = `WHERE id = ${cartId}`;
    let cartOwner = await cartObj.listRecords("user_id");

    if (cartOwner !== userId)
      return { ...return_results, message: "unauthorized_access" };

    this.where = `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`;

    const existingItemResult = await this.listRecords();

    if (existingItemResult.length === 0) {
      return false;
    }

    const existingItem = existingItemResult[0];

    if (existingItem.quantity === 1) {
      let deletedItem = await this.delete(
        "cartitems",
        `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`
      );
      if (!deletedItem)
        return {
          ...return_results,
          message: "failed_to_remove_item",
        };
      return existingItem;
    }

    const newQuantity = existingItem.quantity - 1;
    let updatedQuantity = await this.update(
      "cartitems",
      { quantity: newQuantity },
      `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`
    );
    if (!updatedQuantity)
      return { ...return_results, message: "failed_to_remove_item" };
    return_results = {
      error: false,
      message: "item_quantity_updated_successfully",
      results: {
        ...existingItem,
        quantity: newQuantity,
      },
    };
    return return_results;
  }
}
