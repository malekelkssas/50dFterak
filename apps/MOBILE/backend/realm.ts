import Realm from 'realm';
import { Invoice } from './models/Invoice';
import { User } from './models/User';
import { Order } from './models/Order';
import { OrgSettings } from './models/OrgSettings';

let realmInstance: Realm | null = null;

export function getRealm(): Realm {
  if (!realmInstance) {
    realmInstance = new Realm({
      schema: [Invoice, User, Order, OrgSettings],
      schemaVersion: 4,
      onMigration(oldRealm, newRealm) {
        if (oldRealm.schemaVersion < 4) {
          if (newRealm.objects('OrgSettings').length === 0) {
            newRealm.create('OrgSettings', {
              _id: 'singleton',
              globalPricePerKg: 0,
            });
          }
        }
      },
    });
  }
  return realmInstance;
}

export function closeRealm(): void {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
}
