import Realm from 'realm';
import { Invoice } from './models/Invoice';

let realmInstance: Realm | null = null;

export function getRealm(): Realm {
    if (!realmInstance) {
        realmInstance = new Realm({
            schema: [Invoice],
            schemaVersion: 1,
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
