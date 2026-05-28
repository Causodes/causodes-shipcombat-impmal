const { NpcShipSheetMixin } = globalThis.ShipCombat._api;

export class NpcShipSheet extends NpcShipSheetMixin(IMActorSheet) {
  static DEFAULT_OPTIONS = {
    classes: ["vehicle", "shipcombat-ship", "shipcombat-npc-ship"],
  };
}
