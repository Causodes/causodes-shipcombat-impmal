const { ShipComponentSchemaMixin } = globalThis.ShipCombat._api;

export class ShipComponentModel extends ShipComponentSchemaMixin(warhammer.models.BaseWarhammerItemModel) {}
