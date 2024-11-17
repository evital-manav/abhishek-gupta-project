import { appdb } from "./appdb"; // Import the base class

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

    let results= await this.allRecords(fields);
     results =  results? results.rows: []
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

    // const existingItemResult = await this.select(
    //   "cartitems",
    //   "*",
    //   `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`,"",""
    // );

    if (existingItemResult && existingItemResult.length > 0) {
      const existingItem = existingItemResult[0];
      const newQuantity =
        (existingItem.quantity as number) +
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
  async removeItemFromCart(
    cartId: number | string,
    foodItemId: number | string
  ) {
    const existingItemResult = await this.select(
      "cartitems",
      "*",
      `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`,
      "",
      ""
    );

    if (existingItemResult.length === 0) {
      return false;
    }

    const existingItem = existingItemResult[0];

    if (existingItem.quantity === 1) {
      await this.delete(
        "cartitems",
        `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`
      );
      return existingItem;
    }

    const newQuantity = existingItem.quantity - 1;
    await this.update(
      "cartitems",
      { quantity: newQuantity },
      `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`
    );
    return { ...existingItem, quantity: newQuantity };
  }
}
