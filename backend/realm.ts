import Realm from 'realm';
import { Invoice } from './models/Invoice';
import { User } from './models/User';
import { Order } from './models/Order';

let realmInstance: Realm | null = null;

export function getRealm(): Realm {
    if (!realmInstance) {
        realmInstance = new Realm({
            schema: [Invoice, User, Order],
            schemaVersion: 3,
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
