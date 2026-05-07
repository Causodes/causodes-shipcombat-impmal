import { ShipSheetMixin } from "../../../../causodes-shipcombat-core/scripts/actors/ship/ShipSheetMixin.js";

export class ShipSheet extends ShipSheetMixin(IMActorSheet) {
  static DEFAULT_OPTIONS = {
    classes: ["vehicle", "shipcombat-ship"],
  };
}
