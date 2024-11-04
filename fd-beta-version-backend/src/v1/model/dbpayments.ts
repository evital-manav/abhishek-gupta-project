import { appdb } from "./appdb";

export class dbPayments extends appdb {
  constructor() {
    super();
    this.table = "payments";
    this.uniqueField = "id";
  }
}
