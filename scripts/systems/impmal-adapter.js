/**
 * ImpmalAdapter – Imperium Maledictum implementation of SystemAdapter.
 *
 * Bridges the engine to:
 *   - IMActorSheet & WarhammerItemSheetV2 (sheet base classes)
 *   - BaseWarhammerActorModel & BaseWarhammerItemModel (data model bases)
 *   - crewActor.setupSkillTest({ key, name }, { modifier }) (skill test API)
 *   - game.impmal.config.availability (config lookups)
 *
 * SystemAdapter and MODULE_ID live in the sibling causodes-shipcombat-core
 * module; the relative import path goes up to modules/ and back down.
 */

import { SystemAdapter } from "../../../causodes-shipcombat-core/scripts/systems/SystemAdapter.js";
import { MODULE_ID } from "../../../causodes-shipcombat-core/scripts/constants.js";

// Specialisation list, lazily loaded from the impmal-core compendium.
let _allSpecsCache = null;

/**
 * Every Specialisation item in `impmal-core.items` as a flat sorted array of
 * { value, skillKey, specName, label }. `value` matches the
 * "skillKey|specName" format stored in `roleSkillOverrides`. Cached after
 * the first successful load.
 */
export async function loadAllSpecialisations() {
  if (_allSpecsCache) return _allSpecsCache;
  const pack = game.packs.get("impmal-core.items");
  if (!pack) return (_allSpecsCache = []);
  const docs = await pack.getDocuments({ type: "specialisation" });
  const skillLabels = game.impmal?.config?.skills ?? {};
  _allSpecsCache = docs
    .filter(d => d.system?.skill)
    .map(d => ({
      value:    `${d.system.skill}|${d.name}`,
      skillKey: d.system.skill,
      specName: d.name,
      label:    `${game.i18n.localize(skillLabels[d.system.skill] ?? d.system.skill)} (${d.name})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return _allSpecsCache;
}

// ── Skill map ────────────────────────────────────────────────────────────────
// Abstract role-skill identifiers → impmal's { key, name } pattern.
const SKILL_MAP = {
  leadership:  { key: "presence",  name: "Leadership" },
  engineering: { key: "tech",       name: "Engineering" },
  pilot:       { key: "piloting",   name: "Major Ship" },
  sensors:     { key: "intuition",  name: "Surroundings" },
  ordnance:    { key: "athletics",  name: "Might" },
  gunner:      { key: "ranged",     name: "Ordnance" },
  navigation:  { key: "navigation", name: "Warp" },
};

function _num(...values) {
  for (const v of values) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function _normalise(s) {
  return String(s ?? "").trim().toLowerCase();
}

function _findSpecialisationItem(crewActor, key, name) {
  const targetKey = _normalise(key);
  const targetName = _normalise(name);
  const specs = crewActor?.itemTypes?.specialisation ?? [];
  return specs.find(spec => {
    const specKey = _normalise(spec?.system?.skill);
    const specName = _normalise(spec?.name);
    if (specKey !== targetKey) return false;
    return specName === targetName || specName.includes(targetName);
  }) ?? null;
}

function _getInitiativeSkillTotal(crewActor, key, name) {
  const skill = crewActor?.system?.skills?.[key];
  const specs = Array.isArray(skill?.specialisations) ? skill.specialisations : [];
  const specFromTree = specs.find(s => {
    const specName = _normalise(s?.name ?? s?.label ?? s?.system?.name);
    const targetName = _normalise(name);
    return specName === targetName || specName.includes(targetName);
  }) ?? null;

  const specItem = _findSpecialisationItem(crewActor, key, name);

  return _num(
    specFromTree?.system?.total,
    specFromTree?.total,
    specItem?.system?.total,
    skill?.total,
    skill?.target,
    skill?.value,
  );
}

export class ImpmalAdapter extends SystemAdapter {

  get systemName() { return "Imperium Maledictum"; }

  /* ── Base classes ──────────────────────────────────────────────────────── */

  get SheetBaseClass() {
    return IMActorSheet;
  }

  get ActorModelBaseClass() {
    return warhammer.models.BaseWarhammerActorModel;
  }

  get ItemModelBaseClass() {
    return warhammer.models.BaseWarhammerItemModel;
  }

  get ItemSheetBaseClass() {
    return warhammer.apps.WarhammerItemSheetV2;
  }

  /* ── Skill tests ───────────────────────────────────────────────────────── */

  resolveSkill(roleSkill) {
    if (SKILL_MAP[roleSkill]) return { ...SKILL_MAP[roleSkill] };
    // Pipe-separated "skillKey|specName" form (set by roleSkillOverrides).
    if (roleSkill?.includes("|")) {
      const idx  = roleSkill.indexOf("|");
      const key  = roleSkill.slice(0, idx);
      const name = roleSkill.slice(idx + 1);
      return { key, name };
    }
    throw new Error(`ImpmalAdapter: unknown roleSkill "${roleSkill}"`);
  }

  async rollSkillTest(crewActor, roleSkill, options = {}) {
    const { key, name } = this.resolveSkill(roleSkill);
    const test = await crewActor.setupSkillTest(
      { key, name },
      { modifier: options.modifier ?? 0 },
    );
    if (!test) return null;
    return {
      SL:        test.result?.SL ?? 0,
      succeeded: (test.result?.SL ?? 0) >= 0,
      roll:      test.result?.roll ?? null,
      messageId: test.context?.messageId ?? test.message?.id ?? "",
    };
  }

  /* ── Roll mechanic primitives ──────────────────────────────────────────── */

  getRollFormula() { return "1d100"; }

  /**
   * IM/WFRP success level: floor((target - roll) / 10). Identical to
   * floor(target/10) - floor(roll/10) for our purposes.
   */
  computeSuccessLevel(roll, target) {
    return Math.floor(((target ?? 0) - (roll?.total ?? 0)) / 10);
  }

  /** d100 "≤5 always crits" rule, independent of the target number. */
  isAutomaticCrit(roll) {
    const r = roll?.total;
    return Number.isFinite(r) && r <= 5;
  }

  /** Doubles (matching tens/units) on a hit count as crits. */
  isCriticalHit(roll, target) {
    const r = roll?.total;
    if (!Number.isFinite(r)) return false;
    if (r > target) return false;
    const tens  = Math.floor(r / 10) % 10;
    const units = r % 10;
    return tens === units;
  }

  /** Misses of 96–100 jam if the weapon has the Unreliable trait. */
  isJam(roll, target, traits) {
    const r = roll?.total;
    if (!Number.isFinite(r)) return false;
    return r > target && r >= 96 && !!traits?.unreliable;
  }

  /* ── Sensor lock retention thresholds ──────────────────────────────────── */

  /**
   * The default 1:1 SL→tier clamp matches IM exactly, so this override is
   * just for documentation; remove if you ever need to slim the file.
   */
  getLockTierForSL(sl) {
    if (!Number.isFinite(sl)) return 0;
    if (sl >= 4) return 4;
    if (sl >= 3) return 3;
    if (sl >= 2) return 2;
    if (sl >= 1) return 1;
    return 0;
  }

  /* ── Role default skill mapping ────────────────────────────────────────── */

  getDefaultRoleSkillMapping() {
    return {
      captain:   { skillKey: "presence",  specialisation: "Leadership",     rootLabel: "Presence",  label: "SHIPCOMBAT.MainSkill.Leadership" },
      engineer: { skillKey: "tech",      specialisation: "Engineering",    rootLabel: "Tech",      label: "SHIPCOMBAT.MainSkill.Engineering" },
      pilot:     { skillKey: "piloting",  specialisation: "Major Ship", rootLabel: "Piloting",  label: "SHIPCOMBAT.MainSkill.MajorShip" },
      sensors:   { skillKey: "intuition", specialisation: "Surroundings",   rootLabel: "Intuition", label: "SHIPCOMBAT.MainSkill.IntuitionSurroundings" },
      gunner:    { skillKey: "ranged",    specialisation: "Ordnance",       rootLabel: "Ranged",    label: "SHIPCOMBAT.MainSkill.RangedOrdnance" },
      ordnance:  { skillKey: "athletics", specialisation: "Might",          rootLabel: "Athletics", label: "SHIPCOMBAT.MainSkill.AthleticsMight" },
    };
  }

  /* ── Initiative rolls ──────────────────────────────────────────────────── */

  /**
   * Initiative = 1d10 + skillTotal/100. Encoding skill in the fractional
   * part lets the combat tracker break d10 ties by skill deterministically.
   * Accepts either a SKILL_MAP key or an explicit "skillKey|specName" string.
   */
  async rollShipInitiative(crewActor, roleSkill, options = {}) {
    const { key, name } = this.resolveSkill(roleSkill);
    const total  = _getInitiativeSkillTotal(crewActor, key, name);
    const mod    = (total / 100).toFixed(2);
    const roll   = await new Roll(`1d10 + ${mod}`).evaluate();
    const msg    = await roll.toMessage({
      flavor:  options.flavor  ?? "",
      speaker: options.speaker ?? {},
    });
    return { total: roll.total, roll, message: msg };
  }

  /**
   * NPC ships store `attributes.piloting` directly. Same shape as the
   * crew-actor path: 1d10 + attribute/100.
   */
  async rollShipInitiativeFromAttribute(attributeValue, flavorLabel, options = {}) {
    const mod  = (Number(attributeValue ?? 0) / 100).toFixed(2);
    const roll = await new Roll(`1d10 + ${mod}`).evaluate();
    const msg  = await roll.toMessage({
      flavor:  flavorLabel,
      speaker: options.speaker ?? {},
    });
    return { total: roll.total, roll, message: msg };
  }

  /**
   * IM: the raw total is used directly as the combatant initiative value.
   */
  toCombatantInitiative(rawTotal, _shipActor) { return rawTotal; }

  /* ── Hit resolution ────────────────────────────────────────────────────── */

  /** IM modifier step: 1 step = 10 percentile points. */
  getModifierStepSize() { return 10; }

  /** IM modifiers are displayed with a "%" suffix. */
  formatModifier(value) {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value}%`;
  }

  /** IM accuracy is expressed as a percentile target number. */
  formatTargetNumber(target) { return `${target}%`; }

  /** IM uses a roll-under system: roll ≤ target → hit. */
  isHit(roll, target) { return (roll?.total ?? 0) <= target; }

  /**
   * Zone 1 (close scan) bonus: halve the remaining miss chance.
   * bonus = (100 − totalAccuracy) / 2, rounded to nearest integer.
   */
  computeZone1Bonus(totalAccuracy) {
    return Math.round((100 - totalAccuracy) / 2);
  }

  /**
   * Full single-shot hit resolution.
   * Sums all modifiers onto baseAccuracy, clamps to [1, 99], rolls 1d100,
   * then returns a complete outcome with SL, breakdown, and chat message.
   */
  async resolveHitRoll({ baseAccuracy, modifiers = [], weaponItem, targetActor, options = {} } = {}) {
    const total  = modifiers.reduce((acc, m) => acc + m.value, baseAccuracy);
    const capped = Math.min(99, Math.max(1, total));
    const roll   = await new Roll("1d100").evaluate();
    const hit    = this.isHit(roll, capped);
    const sl     = this.computeSuccessLevel(roll, capped);

    const _sign = n => n >= 0 ? `+${n}` : `${n}`;
    const breakdownParts = [
      `Base Sensor: ${baseAccuracy}%`,
      ...modifiers.filter(m => m.value !== 0).map(m => `${m.label}: ${_sign(m.value)}%`),
    ];

    const msg = await roll.toMessage({
      flavor:  options.flavor  ?? "",
      speaker: options.speaker ?? {},
    });
    return { hit, sl, roll, message: msg, displayTarget: capped, breakdownParts };
  }

  /* ── Schema extensions ────────────────────────────────────────────────────── */

  /** IM components use no extended fields. */
  getComponentSchemaExtensions(_componentType) { return {}; }

  /* ── System config ────────────────────────────────────────────────────── */
  getAvailabilityOptions() {
    return game.impmal?.config?.availability ?? {};
  }

  /* ── Module identity ───────────────────────────────────────────────────── */

  get moduleId() { return MODULE_ID; }

  /* ── Skill labels ──────────────────────────────────────────────────────── */

  getSkillLabel(key) {
    const skillLabels = game.impmal?.config?.skills ?? {};
    return game.i18n.localize(skillLabels[key] ?? key);
  }

  async getRoleSkillOptions() {
    return loadAllSpecialisations();
  }

  /* ── Crew eligibility ──────────────────────────────────────────────────── */

  isCrewActorEligible(actor) {
    return actor?.type === "character";
  }

  /* ── Model stubs ───────────────────────────────────────────────────────── */

  initModelStubs(model) {
    model._addModelProperties();
    model.characteristics = {};
    model.skills = {};
  }

  /**
   * Translate hull damage into warhammer-lib's HealthEstimate fields.
   * Core stores `hull.value` as accumulated damage (0 = pristine);
   * HealthEstimate / warhammer-lib expect remaining HP in `combat.wounds`.
   */
  applyHullDisplay(model) {
    model.combat.wounds.value = model.hull.max - model.hull.value;
    model.combat.wounds.max   = model.hull.max;
  }

  get sheetCSSClasses() { return ["impmal", "causodes-shipcombat-impmal"]; }
}
