/**
 * causodes-shipcombat-impmal – Imperium Maledictum integration layer.
 *
 * This module activates the system-agnostic causodes-shipcombat-core engine by
 * calling ShipCombat.configure() at module-evaluation time (before the Foundry
 * "init" hook fires).
 *
 * Everything else – actor models, sheets, templates, settings, canvas overlays,
 * socket setup, animations – is owned and registered by the core engine.
 */

import { ImpmalAdapter } from "./scripts/systems/impmal-adapter.js";
import { MODULE_ID } from "../causodes-shipcombat-core/scripts/constants.js";
import { ShipModel } from "./scripts/actors/ship/ShipModel.js";
import { ShipSheet } from "./scripts/actors/ship/ShipSheet.js";
import { NpcShipModel } from "./scripts/actors/npc/NpcShipModel.js";
import { NpcShipSheet } from "./scripts/actors/npc/NpcShipSheet.js";
import { ShipOrdnanceModel } from "./scripts/actors/ordnance/ShipOrdnanceModel.js";
import { OrdnanceSheet } from "./scripts/actors/ordnance/OrdnanceSheet.js";
import { ShipComponentModel } from "./scripts/items/ShipComponentModel.js";
import { ShipComponentSheet } from "./scripts/items/ShipComponentSheet.js";

// ── Activate the ship combat engine ──────────────────────────────────────────
// causodes-shipcombat-core loads before this module (it is listed as a required
// dependency) and sets globalThis.ShipCombat during its own module evaluation.

ShipCombat.configure({
  moduleId: "causodes-shipcombat-impmal",
  adapter:  new ImpmalAdapter(),
});

// ── Register models and sheets ───────────────────────────────────────────────

Hooks.once("init", () => {
  Object.assign(CONFIG.Actor.dataModels, {
    [`${MODULE_ID}.ship`]:              ShipModel,
    [`${MODULE_ID}.npcShip`]:           NpcShipModel,
    [`${MODULE_ID}.shipOrdnance`]:  ShipOrdnanceModel,
  });
  Object.assign(CONFIG.Item.dataModels, {
    [`${MODULE_ID}.component`]: ShipComponentModel,
  });

  CONFIG.Actor.typeLabels[`${MODULE_ID}.ship`]             = `TYPES.Actor.${MODULE_ID}.ship`;
  CONFIG.Actor.typeLabels[`${MODULE_ID}.npcShip`]          = `TYPES.Actor.${MODULE_ID}.npcShip`;
  CONFIG.Actor.typeLabels[`${MODULE_ID}.shipOrdnance`] = `TYPES.Actor.${MODULE_ID}.shipOrdnance`;
  CONFIG.Item.typeLabels[`${MODULE_ID}.component`]         = `TYPES.Item.${MODULE_ID}.component`;

  foundry.applications.apps.DocumentSheetConfig.registerSheet(Actor, MODULE_ID, ShipSheet,
    { types: [`${MODULE_ID}.ship`],             makeDefault: true, label: "SHIPCOMBAT.Sheet.Ship"              });
  foundry.applications.apps.DocumentSheetConfig.registerSheet(Actor, MODULE_ID, NpcShipSheet,
    { types: [`${MODULE_ID}.npcShip`],          makeDefault: true, label: "SHIPCOMBAT.Sheet.NpcShip"           });
  foundry.applications.apps.DocumentSheetConfig.registerSheet(Actor, MODULE_ID, OrdnanceSheet,
    { types: [`${MODULE_ID}.shipOrdnance`], makeDefault: true, label: "SHIPCOMBAT.Sheet.ShipOrdnance"  });
  foundry.applications.apps.DocumentSheetConfig.registerSheet(Item,  MODULE_ID, ShipComponentSheet,
    { types: [`${MODULE_ID}.component`],        makeDefault: true, label: "SHIPCOMBAT.Sheet.Component"         });

  // ── Partial overrides ────────────────────────────────────────────────────
  // The IM flavour relies on lang-key overrides (SHIPCOMBAT.Term.*, SHIPCOMBAT.Role.*) —
  // see lang/en.json — so no actual partial template overrides are needed in v1.
  // To replace a partial's full layout for a future system, call e.g.:
  //   ShipCombat.registerPartialOverride(
  //     "captain-conditions",
  //     "modules/<this-module>/templates/partials/captain-conditions.hbs",
  //   );
  // Must happen during this "init" hook; core compiles partials in "setup".
});
