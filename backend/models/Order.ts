import Realm, { BSON } from 'realm';
import { User } from './User';

export class Order extends Realm.Object<Order> {
    _id!: BSON.ObjectId;
    createdAt!: Date;
    day!: number;
    month!: number;
    year!: number;
    flourAmount!: number;
    user!: User;
    doneAt!: Date | null;

    static schema: Realm.ObjectSchema = {
        name: 'Order',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', default: () => new BSON.ObjectId() },
            createdAt: { type: 'date', default: () => new Date() },
            day: 'int',
            month: 'int',
            year: 'int',
            flourAmount: 'double',
            user: 'User',
            doneAt: 'date?',
        },
    };
}

export type OrderData = {
    day: number;
    month: number;
    year: number;
    flourAmount: number;
    user: User;
};
