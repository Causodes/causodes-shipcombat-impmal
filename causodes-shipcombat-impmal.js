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

const ShipCombat = await new Promise((resolve, reject) => {
  if (globalThis.ShipCombat?._api) {
    resolve(globalThis.ShipCombat);
    return;
  }

  const timeout = setTimeout(() => {
    reject(new Error("causodes-shipcombat-impmal | Core API did not become available during module startup."));
  }, 10_000);
  Hooks.once("shipCombatApiReady", api => {
    clearTimeout(timeout);
    resolve(api);
  });
});

const [
  { ImpmalAdapter },
  { ShipModel },
  { ShipSheet },
  { NpcShipModel },
  { NpcShipSheet },
  { ShipOrdnanceModel },
  { OrdnanceSheet },
  { ShipComponentModel },
  { ShipComponentSheet },
  { migrateNpcIntegerFields },
] = await Promise.all([
  import("./scripts/systems/impmal-adapter.js"),
  import("./scripts/actors/ship/ShipModel.js"),
  import("./scripts/actors/ship/ShipSheet.js"),
  import("./scripts/actors/npc/NpcShipModel.js"),
  import("./scripts/actors/npc/NpcShipSheet.js"),
  import("./scripts/actors/ordnance/ShipOrdnanceModel.js"),
  import("./scripts/actors/ordnance/OrdnanceSheet.js"),
  import("./scripts/items/ShipComponentModel.js"),
  import("./scripts/items/ShipComponentSheet.js"),
  import("./scripts/migrations.js"),
]);

// ── Activate the ship combat engine ──────────────────────────────────────────
// The imports above wait for causodes-shipcombat-core to publish its API.

const MODULE_ID = "causodes-shipcombat-impmal";

ShipCombat.configure({
  moduleId: MODULE_ID,
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

  // ── AutoAnimations v14 compatibility ─────────────────────────────────────
  // ImpMal v14 moved the skill key from dialogData.context.skill (v13) to
  // dialogData.data.skill. AutoAnimations' ImpMal hook still reads
  // msg.system.context.skill and crashes with "Cannot read properties of
  // undefined (reading 'includes')" when it is absent.
  // Backfill context.skill from data.skill before the message is persisted.
  Hooks.on("preCreateChatMessage", (doc, _data, _options, _userId) => {
    const cls = doc.system?.class;
    if (!cls || cls === "WeaponTest") return;    // weapons are handled separately by AA
    if (doc.system.context?.skill) return;       // already present, nothing to do
    const skillKey = doc.system.data?.skill;
    if (skillKey) {
      doc.updateSource({ "system.context.skill": skillKey });
    }
  });
});

Hooks.once("ready", async () => {
  await migrateNpcIntegerFields();
});
