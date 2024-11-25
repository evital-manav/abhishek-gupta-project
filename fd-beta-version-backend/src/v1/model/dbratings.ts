import { appdb } from "./appdb";

export class dbRatings extends appdb {
  constructor() {
    super();
    this.table = "rating";
    this.uniqueField = "id";
  }
}
