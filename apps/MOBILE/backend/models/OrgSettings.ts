import Realm from 'realm';

/** Org-wide settings; use fixed singleton id `_id === 'singleton'` only. */
export class OrgSettings extends Realm.Object<OrgSettings> {
  _id!: string;
  globalPricePerKg!: number;

  static schema: Realm.ObjectSchema = {
    name: 'OrgSettings',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      globalPricePerKg: { type: 'double', default: 0 },
    },
  };
}
