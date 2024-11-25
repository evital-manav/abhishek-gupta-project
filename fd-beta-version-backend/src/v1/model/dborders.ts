import { appdb } from "./appdb";

export class dborders extends appdb {
  constructor() {
    super();
    this.table = "orders";
    this.uniqueField = "id";
  }

  /**
   * Fetch order details including restaurant name, food items, and total price for a user.
   * @param userId - ID of the user
   * @returns Order details object
   */

  async getOrderDetails(userId: number) {
    const fields = `
      rs.name AS restaurantName, 
      (odi.price * odi.quantity) AS total_price, 
      odi.food_item_id, 
      odi.quantity, 
      odi.price
    `;

    const table = `
      restaurants rs
      JOIN ${this.table} od ON od.restaurant_id = rs.id
      JOIN order_items odi ON odi.order_id = od.id
    `;

    this.where = `WHERE od.customer_id = ${userId}`;
    this.orderby = "";

    this.table = table;

    try {
      const result = await this.allRecords(fields);
      return result.length ? result : [];
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  }

  /**
   * Get total order amount for a specific order using the `select` method.
   * @param userId - ID of the user
   * @param orderId - ID of the order
   * @returns Total amount of the order
   */
  async getTotalForOrderId(userId: number, orderId: number) {
    const fields = "totalamount";

    this.where = `WHERE customer_id = ${userId} AND id = ${orderId}`;

    const results = await this.allRecords(fields);

    return results.length > 0 ? results : [];
  }
}
