import { appdb } from "./appdb";

export class dborders extends appdb {
  constructor() {
    super();
    this.table = "orders";
    this.uniqueField = "id";
  }

  /**
   * Create a new order in the database using the `insertRecord` method.
   * @param userId - ID of the user who placed the order
   * @param restaurantId - ID of the restaurant
   * @param totalPrice - Total price of the order
   * @returns Newly created order object
   */
  async createOrder(userId: number, restaurantId: number, totalPrice: number) {
    const orderData = {
      customer_id: userId,
      restaurant_id: restaurantId,
      totalamount: totalPrice,
      orderstatus: "pending",
    };
    const result = await this.insertRecord(orderData);

    return result;
  }

  /**
   * Fetch order details including restaurant name, food items, and total price for a user.
   * @param userId - ID of the user
   * @returns Order details object
   */
  // async getOrderDetails(userId: number) {
  //   const table = `
  //     restaurants rs
  //     JOIN ${this.table} od ON od.restaurant_id = rs.id
  //     JOIN order_items odi ON odi.order_id = od.id
  //   `;
  //   const fields = `
  //     rs.name AS restaurantName,
  //     (odi.price * odi.quantity) AS total_price,
  //     odi.food_item_id,
  //     odi.quantity,
  //     odi.price
  //   `;
  //   const where = `WHERE od.customer_id = ${userId}`;

  //   // Use the select method from the parent db class
  //   const result = await this.select(table, fields, where, "", "");
  //   return result;
  // }
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
      return result.length ? result : null;
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
  async getTotalForOrderId(userId: number, orderId: number): Promise<number> {
    const fields = "totalamount";

    this.where = `WHERE customer_id = ${userId} AND id = ${orderId}`;

    try {
      const result = await this.allRecords(fields);

      console.log("result[0].totalamount", result[0].totalamount);

      return result.length > 0 ? result[0].totalamount : 0;
    } catch (error) {
      console.log("Error fetching total amount:", error);
      throw error;
    }
  }
}
