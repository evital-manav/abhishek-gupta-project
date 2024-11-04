import { appdb } from "./appdb";

export class dbRestaurant extends appdb {
  constructor() {
    super();
    this.table = "restaurants";
    this.uniqueField = "id";
  }

  /**
   * Insert new restaurant record in the database.
   * @param restaurantData - Object containing the restaurant data
   * @returns newly inserted restaurant object
   */
  async insertRestaurant(restaurantData: {
    name: string;
    address: string;
    phone: string;
    owner_id: number;
  }) {
    return this.insertRecord(restaurantData);
  }

  /**
   * Fetch all restaurants from the database.
   * @returns Array of restaurant objects
   */
  async getAllRestaurants() {
    return this.allRecords("*");
  }

  /**
   * Fetch restaurant by unique ID from the database.
   * @param restaurantId - Restaurant's unique ID
   * @returns restaurant object or null if not found
   */
  async getRestaurantById(restaurantId: number) {
    return this.selectRecord(restaurantId);
  }

  /**
   * Update an existing restaurant record.
   * @param restaurantId - Restaurant's unique ID
   * @param restaurantData - Object containing restaurant details to be updated
   * @returns number of affected rows
   */
  async updateRestaurant(restaurantId: number, restaurantData: any) {
    return this.updateRecord(restaurantId, restaurantData);
  }

  /**
   * Get menu and food items for a specific restaurant.
   * @param restaurantId - Restaurant's unique ID
   * @returns Array of menu and food items or null if no items found
   */
  // async getMenuWithFoodItems(restaurantId: number) {
  //   let fields = `
  //     fi.id AS foodItemId,
  //     rm.menuname,
  //     fi.item_name,
  //     fi.price,
  //     fi.description,
  //     fi.isavailable
  //   `;

  //   let where = `WHERE rm.restaurant_id = ${restaurantId}`;

    
  //   let table = `
  //     restaurantMenu rm
  //     JOIN foodItems fi ON rm.id = fi.menu_id
  //   `;

  //   // Call select with the correct table and where clause
  //   let result = await this.select(table, fields, where, "", "");

  //   return result.length ? result : null;
  // }

  /**
   * Search restaurants by name.
   * @param name - Restaurant name to search
   * @returns Array of matching restaurants
   */
  async searchByName(name: string) {
    this.where = `WHERE LOWER(name) LIKE LOWER('%${name}%')`;
    return this.allRecords("*");
  }
}

export default dbRestaurant;
