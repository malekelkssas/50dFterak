import Realm, { BSON } from 'realm';

export class User extends Realm.Object<User> {
    _id!: BSON.ObjectId;
    name!: string;
    phoneNumber!: string;
    flourAmount!: number;
    createdAt!: Date;

    static schema: Realm.ObjectSchema = {
        name: 'User',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', default: () => new BSON.ObjectId() },
            name: 'string',
            phoneNumber: 'string',
            flourAmount: { type: 'double', default: 0 },
            createdAt: { type: 'date', default: () => new Date() },
        },
    };
}

export type UserData = {
    name: string;
    phoneNumber: string;
    flourAmount: number;
};

export type UserUpdateData = Partial<UserData>;
