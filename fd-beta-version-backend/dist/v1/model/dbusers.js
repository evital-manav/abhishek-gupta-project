"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbusers = void 0;
const appdb_1 = require("./appdb");
class dbusers extends appdb_1.appdb {
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
    insertUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.insertRecord(userData);
        });
    }
    /**
     * Get a user by email
     * @param email - The email of the user to search for
     * @returns - The user record if found, null if not found
     */
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            this.where = `WHERE email = '${email}'`;
            const result = yield this.allRecords();
            return result.length > 0 ? result[0] : null;
        });
    }
    /**
     * Insert an address for a user
     * @param addressData - An object containing the user's address information
     * @returns - The inserted address record
     */
    createAddress(addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.table = "address";
            return this.insertRecord(addressData);
        });
    }
}
exports.dbusers = dbusers;
