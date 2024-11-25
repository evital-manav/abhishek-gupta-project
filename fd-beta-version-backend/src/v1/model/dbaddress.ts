import { appdb } from "./appdb";

export class dbAddress extends appdb {
  constructor() {
    super();
    this.table = "address";
    this.uniqueField = "id";
  }
}
