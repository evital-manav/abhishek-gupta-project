import { appdb } from "./appdb";

export class dbusers extends appdb {
  constructor() {
    super();
    this.table = "users";
    this.uniqueField = "id";
  }

  /**
   * Insert a new user into the database
   * @param userData - An object containing user information
   * @returns - Inserted user record
   */
  async insertUser(userData: any) {
    return this.insertRecord(userData);
  }

  /**
   * Get a user by email
   * @param email - The email of the user to search for
   * @returns - The user record if found, null if not found
   */
  async getUserByEmail(email: string) {
    this.where = `WHERE email = '${email}'`;
    const result = await this.allRecords();

    return result.length > 0 ? result[0] : null;
  }
}
