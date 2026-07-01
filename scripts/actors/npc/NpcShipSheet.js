const { NpcShipSheetMixin } = globalThis.ShipCombat._api;

const MODULE_ID = "causodes-shipcombat-impmal";
const _NpcShipSheetBase = NpcShipSheetMixin(IMActorSheet);

export class NpcShipSheet extends _NpcShipSheetBase {
  static DEFAULT_OPTIONS = {
    classes: ["vehicle", "shipcombat-ship", "shipcombat-npc-ship"],
  };

  // The impmal header already shows Ship Stats and Armour, so use a variant
  // body template that omits those duplicated sections.
  static PARTS = {
    ..._NpcShipSheetBase.PARTS,
    main: {
      ..._NpcShipSheetBase.PARTS.main,
      template: `modules/${MODULE_ID}/templates/actor/tabs/npc/npc-ship-body-impmal.hbs`,
    },
  };
}
