import { OrdnanceSchemaMixin } from "../../../../causodes-shipcombat-core/scripts/actors/ordnance/OrdnanceSchema.js";

export class ShipOrdnanceModel extends OrdnanceSchemaMixin(warhammer.models.BaseWarhammerActorModel) {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();
    schema.combat = new fields.SchemaField({
      wounds: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0, integer: true }),
        max:   new fields.NumberField({ initial: 0, integer: true }),
      }),
    });
    return schema;
  }
}
