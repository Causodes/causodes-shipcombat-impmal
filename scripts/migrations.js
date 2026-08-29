/**
 * migrations.js – Data migrations for causodes-shipcombat-impmal.
 *
 * When a world previously used the impmal-shipcombat module and is opened with
 * causodes-shipcombat-impmal for the first time, actor/item document types need
 * to be renamed:
 *
 *   OLD (impmal-shipcombat)          NEW (causodes-shipcombat-impmal)
 *   ────────────────────────────     ────────────────────────────────────────
 *   impmal-shipcombat.ship       →   causodes-shipcombat-impmal.ship
 *   impmal-shipcombat.npcShip    →   causodes-shipcombat-impmal.npcShip
 *   impmal-shipcombat.torpedo    →   causodes-shipcombat-impmal.torpedo
 *   impmal-shipcombat.strikeCraft →  causodes-shipcombat-impmal.strikeCraft
 *   impmal-shipcombat.component  →   causodes-shipcombat-impmal.component
 *
 * Migration is triggered once per world via the "ready" hook and a module
 * setting flag.  Only the GM client executes it.
 *
 * Call runMigrations() manually or wire it into a "ready" hook from the
 * integration entry point.
 */

const OLD_MODULE  = "impmal-shipcombat";
const NEW_MODULE  = "causodes-shipcombat-impmal";

const ACTOR_TYPES = ["ship", "npcShip", "torpedo", "strikeCraft"];
const ITEM_TYPES  = ["component"];
const NPC_INTEGER_PATHS = [
  "hull.value",
  "hull.max",
  "internalFire",
  "voidshieldFlux",
  "movement.speed",
  "movement.maneuverability",
  "movement.baseSpeed",
  "movement.baseManeuverability",
  "attributes.piloting",
  "attributes.tech",
  "attributes.gunnery",
  "autoScanRange",
  "sensorBandSize",
  "sensorRating",
  ...["bow", "stern", "port", "starboard"].flatMap(sector => [
    `armour.${sector}`,
    `armourBase.${sector}`,
    `shieldMax.${sector}`,
  ]),
];

function _getProperty(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

/** Repair fractional values written before the NPC integer schema was enforced. */
export async function migrateNpcIntegerFields() {
  if (!game.user.isGM) return 0;
  let count = 0;
  for (const actor of game.actors) {
    if ((actor._source?.type ?? actor.type) !== `${NEW_MODULE}.npcShip`) continue;
    const source = actor._source?.system ?? actor.system;
    const updates = {};
    for (const path of NPC_INTEGER_PATHS) {
      const value = Number(_getProperty(source, path));
      if (Number.isFinite(value) && !Number.isInteger(value)) {
        updates[`system.${path}`] = Math.round(value);
      }
    }
    if (!Object.keys(updates).length) continue;
    await actor.update(updates);
    console.log(`${NEW_MODULE} | Normalized integer NPC stats for "${actor.name}".`);
    count++;
  }
  return count;
}

/**
 * Migrate all world actors whose type is prefixed with the old module ID.
 * @returns {Promise<number>} Number of actors updated.
 */
export async function migrateActorTypes() {
  if (!game.user.isGM) return 0;
  let count = 0;
  for (const actor of game.actors) {
    for (const subtype of ACTOR_TYPES) {
      if (actor.type === `${OLD_MODULE}.${subtype}`) {
        await actor.update({ type: `${NEW_MODULE}.${subtype}` });
        console.log(`${NEW_MODULE} | Migrated actor "${actor.name}" → type ${NEW_MODULE}.${subtype}`);
        count++;
      }
    }
  }
  return count;
}

/**
 * Migrate all world items whose type is prefixed with the old module ID.
 * @returns {Promise<number>} Number of items updated.
 */
export async function migrateItemTypes() {
  if (!game.user.isGM) return 0;
  let count = 0;
  for (const item of game.items) {
    for (const subtype of ITEM_TYPES) {
      if (item.type === `${OLD_MODULE}.${subtype}`) {
        await item.update({ type: `${NEW_MODULE}.${subtype}` });
        console.log(`${NEW_MODULE} | Migrated item "${item.name}" → type ${NEW_MODULE}.${subtype}`);
        count++;
      }
    }
  }
  return count;
}

/**
 * Run all migrations and return a summary.
 * @returns {Promise<{actors: number, items: number}>}
 */
export async function runMigrations() {
  console.log(`${NEW_MODULE} | Starting actor/item type migration from ${OLD_MODULE}…`);
  const actors = await migrateActorTypes();
  const items  = await migrateItemTypes();
  console.log(`${NEW_MODULE} | Migration complete – ${actors} actors, ${items} items updated.`);
  return { actors, items };
}
