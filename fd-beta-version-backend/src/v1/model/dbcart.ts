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

  async getCartByUserId(userId: number) {
    this.where = `WHERE user_id = ${userId}`;
    const result = await this.listRecords();
    return result.length ? result[0] : [];
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
}
