import { NpcShipSchemaMixin } from "../../../../causodes-shipcombat-core/scripts/actors/npc/NpcShipSchema.js";

export class NpcShipModel extends NpcShipSchemaMixin(warhammer.models.BaseWarhammerActorModel) {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();
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
