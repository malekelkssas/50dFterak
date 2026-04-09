import { getRealm } from '../realm';
import { OrgSettings } from '../models/OrgSettings';

class OrgSettingsService {
  private static instance: OrgSettingsService;

  private constructor() {}

  static getInstance(): OrgSettingsService {
    if (!OrgSettingsService.instance) {
      OrgSettingsService.instance = new OrgSettingsService();
    }
    return OrgSettingsService.instance;
  }

  getGlobalPricePerKg(): number {
    const realm = getRealm();
    let row = realm.objectForPrimaryKey(OrgSettings, 'singleton');
    if (!row) {
      realm.write(() => {
        realm.create(OrgSettings, { _id: 'singleton', globalPricePerKg: 0 });
      });
      row = realm.objectForPrimaryKey(OrgSettings, 'singleton');
    }
    return row?.globalPricePerKg ?? 0;
  }

  setGlobalPricePerKg(value: number): void {
    const realm = getRealm();
    realm.write(() => {
      const row = realm.objectForPrimaryKey(OrgSettings, 'singleton');
      if (!row) {
        realm.create(OrgSettings, {
          _id: 'singleton',
          globalPricePerKg: value,
        });
      } else {
        row.globalPricePerKg = value;
      }
    });
  }
}

export const orgSettingsService = OrgSettingsService.getInstance();
