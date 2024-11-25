import { appdb } from "./appdb";

export class dbusers extends appdb {
  constructor() {
    super();
    this.table = "users";
    this.uniqueField = "id";
  }



  /**
   * Get a user by email
   * @param email - The email of the user to search for
   * @returns - The user record if found, null if not found
   */
  async getUserByEmail(email: string) {
    this.where = `WHERE email = '${email}'`;
    const result = await this.allRecords();

    return result.length > 0 ? result[0] : [];
  }
}
