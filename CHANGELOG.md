## v2.2.3
- Require Core 2.5.1 for corrected player and NPC ordnance lifecycle behavior
- Publish an allowlisted runtime-only module archive without repository development files

## v2.2.2
- Wait for the Core API before evaluating ImpMal models and adapters, preventing startup races that leave module document subtypes unregistered

## v2.2.1
- Restore the IMPMAL notes schema required when opening NPC ship sheets
- Normalize malformed fractional NPC stats while retaining integer schema validation
- Bump verified version to 14.367

## v2.2.0
- Update crew-layout guides for shared receiving-operator Power Core pools and separate shield/Auxiliary Power commitments
- Update initiative guidance for Core's next-round reversible combat-tracker bonus
- Route Imperium Maledictum allocation descriptions through Core's shared singular/plural allocation terminology
- Inherit Captain-card category colours from Core's universal card contract instead of duplicating chat-only theme declarations
- Resolve shared accuracy descriptions from adapter values and include percentile units in weapon and strike-craft chat summaries

## v2.1.2
- Fix module not loading on Forge-hosted instances (remove last cross-module ES import of core from the entry script)
- Explicitly classify buttons as type `button` in handlebars templates to prevent unintended form submission behavior

## v2.1.1
- Fix NPC Overview tab showing duplicate stats and armour (header already contains these)

## v2.1.0
- Fix Forge compatibility: access core APIs via globalThis.ShipCombat._api instead of relative ES imports

## v2.0.0
- Initial v14 release
- Fix UI elements broken by v14
- Fix README settings description

## v1.0.0
- Initial v13 release
