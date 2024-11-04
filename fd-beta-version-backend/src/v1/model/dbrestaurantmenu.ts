import { appdb } from "./appdb";

export class dbRestaurantMenu extends appdb {
  constructor() {
    super();
    this.table = "restaurantmenu";
    this.uniqueField = "id";
  }

  async getMenuWithFoodItems(restaurantId: number) {
    const fields = `
      fi.id AS foodItemId,
      rm.menuname,
      fi.item_name,
      fi.price,
      fi.description,
      fi.isavailable
    `;

    this.where = `WHERE rm.restaurant_id =  ${restaurantId}`;
    this.orderby = "";

    const table = `
      restaurantMenu rm
      JOIN foodItems fi ON rm.id = fi.menu_id
    `;

    try {
     
      this.table = table; 
      const result = await this.allRecords(fields);

      return result.length ? result : null;
    } catch (error) {
      console.error("Error fetching menu with food items:", error);
      throw error; 
    } 
  }
}
