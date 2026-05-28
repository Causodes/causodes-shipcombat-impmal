const { ShipComponentSheetMixin } = globalThis.ShipCombat._api;

export class ShipComponentSheet extends ShipComponentSheetMixin(warhammer.apps.WarhammerItemSheetV2) {
  static DEFAULT_OPTIONS = { classes: ["impmal", "causodes-shipcombat-impmal"] };
}
