import { appdb } from "./appdb";

export class dbcart extends appdb {
  constructor() {
    super();
    this.table = "cart";
    this.uniqueField = "id";
  }

  /**
   * Fetch the cart by user ID.
   * @param userId - User's unique ID
   * @returns Cart object or null if not found
   */
  // async getCartByUserId(userId: number) {
  //   const result = await this.select(
  //     this.table,
  //     "*",
  //     `WHERE user_id = ${userId}`,
  //     "",
  //     ""
  //   );
  //   return result.length ? result[0] : null;
  // }
  async getCartByUserId(userId: number) {
    this.where = `WHERE user_id = ${userId}`;
    const result = await this.listRecords("*");
    return result.length ? result[0] : null;
  }
  /**
   * Create a new cart for the user.
   * @param userId - User's unique ID
   * @returns Newly created cart object
   */
  async createCart(userId: number | string) {
    return this.insertRecord({
      user_id: userId,
    });
  }

  /**
   * Get cart items along with their total price.
   * @param cartId - Cart's unique ID
   * @returns Object containing items and total amount
   */
  // async getCartItemsWithTotal(cartId: number | string) {
  //   const fields = `
  //           fi.item_name,
  //           ci.food_item_id,
  //           ci.quantity,
  //           ci.price,
  //           (ci.price * ci.quantity) AS total_price
  //       `;
  //   const table = `
  //           cartitems ci
  //           JOIN fooditems fi ON ci.food_item_id = fi.id
  //       `;
  //   const where = `WHERE ci.cart_id = ${cartId}`;

  //   const rows = await this.select(table, fields, where, "", "");
  //   const totalAmount = rows
  //     .reduce((sum: number, item: any) => sum + parseFloat(item.total_price), 0)
  //     .toFixed(2);

  //   return { items: rows, totalamount: totalAmount };
  // }

  /**
   * Add an item to the cart.
   * @param cartId - Cart's unique ID
   * @param foodItemId - Food item's unique ID
   * @param quantity - Quantity of the food item
   * @param price - Price of the food item
   * @returns Message indicating the result of the operation
   */
  // async addItemToCart(
  //   cartId: number | string,
  //   foodItemId: number | string,
  //   quantity: number | string,
  //   price: number | string
  // ) {
  //   const existingItemResult = await this.select(
  //     "cartitems",
  //     "*",
  //     `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`,
  //     "",
  //     ""
  //   );

  //   if (existingItemResult.length > 0) {
  //     const existingItem = existingItemResult[0];
  //     const newQuantity =
  //       (existingItem.quantity as number) +
  //       (typeof quantity === "string" ? parseInt(quantity) : quantity);

  //     await this.update(
  //       "cartitems",
  //       { quantity: newQuantity },
  //       `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`
  //     );
  //     let data = {
  //       ...existingItem,
  //       quantity: newQuantity,
  //     };
  //     return data;
  //   } else {
  //     const result = await this.insert("cartitems", {
  //       cart_id: cartId,
  //       food_item_id: foodItemId,
  //       quantity: quantity,
  //       price: price,
  //     });
  //     return result;
  //   }
  // }

  /**
   * Remove an item from the cart.
   * @param cartId - Cart's unique ID
   * @param foodItemId - Food item's unique ID
   * @returns Message indicating the result of the operation
   */
  // async removeItemFromCart(
  //   cartId: number | string,
  //   foodItemId: number | string
  // ) {
  //   const existingItemResult = await this.select(
  //     "cartitems",
  //     "*",
  //     `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`,
  //     "",
  //     ""
  //   );

  //   if (existingItemResult.length === 0) {
  //     return false;
  //   }

  //   const existingItem = existingItemResult[0];

  //   if (existingItem.quantity === 1) {
  //     await this.delete(
  //       "cartitems",
  //       `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`
  //     );
  //     return existingItem;
  //   }

  //   const newQuantity = existingItem.quantity - 1;
  //   await this.update(
  //     "cartitems",
  //     { quantity: newQuantity },
  //     `WHERE cart_id = ${cartId} AND food_item_id = ${foodItemId}`
  //   );
  //   return { ...existingItem, quantity: newQuantity };
  // }

  // /**
  //  * Clear all items in the cart.
  //  * @param cartId - Cart's unique ID
  //  * @returns Message indicating the result of the operation
  //  */
  // async clearCart(cartId: number | string) {
  //   await this.delete("cartitems", `WHERE cart_id = ${cartId}`);
  //   return { message: "All items removed from the cart" };
  // }
}
