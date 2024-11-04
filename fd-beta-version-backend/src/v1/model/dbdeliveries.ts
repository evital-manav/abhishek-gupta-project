import { appdb } from "./appdb";

export class dbDeliveries extends appdb {
  constructor() {
    super();
    this.table = "deliveries";
    this.uniqueField = "id";
  }

  // async getDeliveryPersonId(): Promise<number> {
  //   this.table = "users";
  //   this.where = `WHERE userType = 'delivery_person'`;
  //   const result = await this.allRecords("id");

    // if (!result || result.length === 0) {
    //   throw new Error("No delivery person found.");
    // }

  //   return result[0].id;
  // }

  async createDelivery(
    orderId: number,
    deliveryPersonId: number
  ): Promise<any> {
    this.table = "deliveries"; // Switching back to deliveries table

    const deliveryData = {
      order_id: orderId,
      delivery_person_id: deliveryPersonId,
      delivery_status: "processing",
    };

    try {
      const result = await this.insertRecord(deliveryData);
      return result;
    } catch (error) {
      console.log("Error creating delivery:", error);
    }
  }
}
