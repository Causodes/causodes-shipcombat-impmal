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
