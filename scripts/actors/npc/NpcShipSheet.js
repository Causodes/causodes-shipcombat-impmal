import { NpcShipSheetMixin } from "../../../../causodes-shipcombat-core/scripts/actors/npc/NpcShipSheetMixin.js";

export class NpcShipSheet extends NpcShipSheetMixin(IMActorSheet) {
  static DEFAULT_OPTIONS = {
    classes: ["vehicle", "shipcombat-ship", "shipcombat-npc-ship"],
  };
}
