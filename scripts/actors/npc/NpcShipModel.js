const { NpcShipSchemaMixin } = globalThis.ShipCombat._api;

export class NpcShipModel extends NpcShipSchemaMixin(warhammer.models.BaseWarhammerActorModel) {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    // IMPMAL's shared actor sheet unconditionally enriches both note fields.
    // Our NPC model inherits from warhammer-lib's base model rather than
    // IMPMAL's BaseActorModel, so these are not supplied by the parent schema.
    schema.notes = new fields.SchemaField({
      player: new fields.HTMLField({ initial: "" }),
      gm:     new fields.HTMLField({ initial: "" }),
    });

    schema.combat = new fields.SchemaField({
      action:     new fields.StringField({ initial: "" }),
      initiative: new fields.NumberField({ initial: 0, integer: true }),
      wounds: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0, min: 0, integer: true }),
        max:   new fields.NumberField({ initial: 0, min: 0, integer: true }),
      }),
    });
    return schema;
  }
}
