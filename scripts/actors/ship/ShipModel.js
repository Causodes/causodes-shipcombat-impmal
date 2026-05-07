import { ShipSchemaMixin } from "../../../../causodes-shipcombat-core/scripts/actors/ship/ShipSchema.js";

export class ShipModel extends ShipSchemaMixin(warhammer.models.BaseWarhammerActorModel) {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();
    schema.combat = new fields.SchemaField({
      action: new fields.StringField({ initial: "" }),
      wounds: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0, min: 0, integer: true }),
        max:   new fields.NumberField({ initial: 0, min: 0, integer: true }),
      }),
    });
    return schema;
  }
}
