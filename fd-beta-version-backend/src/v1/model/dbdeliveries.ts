import { appdb } from "./appdb";

export class dbDeliveries extends appdb {
  constructor() {
    super();
    this.table = "deliveries";
    this.uniqueField = "id";
  }
}
