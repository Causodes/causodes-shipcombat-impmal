import { ShipSheetMixin } from "../../../../causodes-shipcombat-core/scripts/actors/ship/ShipSheetMixin.js";
import { hullDisplay } from "../../../../causodes-shipcombat-core/scripts/constants.js";

export class ShipSheet extends ShipSheetMixin(IMActorSheet) {
  static DEFAULT_OPTIONS = {
    classes: ["vehicle", "shipcombat-ship"],
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const hull = context.sys?.hull ?? {};
    const _hullDisp = hullDisplay(hull.value ?? 0, hull.max ?? 0);
    context.hullBarLabel = _hullDisp.isDamageTaken
      ? game.i18n.localize("SHIPCOMBAT.Label.HullDamage")
      : game.i18n.localize("SHIPCOMBAT.Label.HullIntegrity");
    return context;
  }
}
