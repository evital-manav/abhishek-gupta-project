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

    const rows = await this.allRecords(fields);

    // Calculate the total amount
    const totalAmount = rows
      .reduce((sum: number, item: any) => sum + parseFloat(item.total_price), 0)
      .toFixed(2);

    // Return the items and total amount
    return { items: rows, totalamount: totalAmount };
  }

  async addItemToCart(
    cartId: number,
    foodItemId: number,
    quantity: number,
    price: number
  ) {
    const existingItemResult = await this.select(
      "cartitems",
      "*",
      `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`,
      "",
      ""
    );

    if (existingItemResult.length > 0) {
      const existingItem = existingItemResult[0];
      const newQuantity =
        (existingItem.quantity as number) +
        (typeof quantity === "string" ? parseInt(quantity) : quantity);

      await this.update(
        "cartitems",
        { quantity: newQuantity },
        `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`
      );
      let data = {
        ...existingItem,
        quantity: newQuantity,
      };
      return data;
    } else {
      const result = await this.insertRecord({
        cart_id: cartId,
        food_item_id: foodItemId,
        quantity: quantity,
        price: price,
      });
      return result;
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

  /**
   * Clear all items in the cart.
   * @param cartId - Cart's unique ID
   * @returns Message indicating the result of the operation
   */
  async clearCart(cartId: number | string) {
    await this.delete("cartitems", `WHERE cart_id = ${cartId}`);
    return { message: "All items removed from the cart" };
  }
}
