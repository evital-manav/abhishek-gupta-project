import { appdb } from "./appdb";

export class dbRestaurant extends appdb {
  constructor() {
    super();
    this.table = "restaurants";
    this.uniqueField = "id";
  }

  /**
   * Fetch all restaurants from the database.
   * @returns Array of restaurant objects
   */
  async getAllRestaurants(name: string) {
    if (name) this.where = `WHERE LOWER(name) LIKE LOWER('%${name}%')`;
    return this.allRecords("*");
  }
}

export default dbRestaurant;
