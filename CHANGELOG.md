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
