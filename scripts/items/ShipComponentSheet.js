import { ShipComponentSheetMixin } from "../../../causodes-shipcombat-core/scripts/items/ShipComponentSheetMixin.js";

export class ShipComponentSheet extends ShipComponentSheetMixin(warhammer.apps.WarhammerItemSheetV2) {
  static DEFAULT_OPTIONS = { classes: ["impmal", "causodes-shipcombat-impmal"] };
}
