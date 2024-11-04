import { appdb } from "./appdb";

export class dbOrderItems extends appdb {
  constructor() {
    super();
    this.table = "order_items"; 
    this.uniqueField = "id"; 
  }

  async addOrderItem(
    orderId: number,
    foodItemId: number,
    quantity: number,
    price: number
  ) {
    const orderItemData = {
      order_id: orderId,
      food_item_id: foodItemId,
      quantity,
      price,
    };

    try {
      
      const result = await this.insertRecord(orderItemData);
      return result; 
    } catch (error) {
      console.error("Error adding order item:", error);
      throw error; 
    }
  }
}


