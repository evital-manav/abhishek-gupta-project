import { appdb } from "./appdb";

export class dbOrderItems extends appdb {
  constructor() {
    super();
    this.table = "order_items";
    this.uniqueField = "id";
  }
}
