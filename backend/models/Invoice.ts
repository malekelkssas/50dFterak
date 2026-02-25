import Realm, { BSON } from 'realm';

export class Invoice extends Realm.Object<Invoice> {
    _id!: BSON.ObjectId;
    year!: number;
    month!: number;
    day!: number;
    time?: string;
    title!: string;
    description?: string;
    price!: number;
    quantity!: number;
    createdAt!: Date;

    static schema: Realm.ObjectSchema = {
        name: 'Invoice',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', default: () => new BSON.ObjectId() },
            year: 'int',
            month: 'int',
            day: 'int',
            time: 'string?',
            title: 'string',
            description: 'string?',
            price: 'double',
            quantity: { type: 'int', default: 1 },
            createdAt: { type: 'date', default: () => new Date() },
        },
    };
}

export type InvoiceData = {
    year: number;
    month: number;
    day: number;
    time?: string;
    title: string;
    description?: string;
    price: number;
    quantity?: number;
};

export type InvoiceUpdateData = Partial<Omit<InvoiceData, 'year' | 'month' | 'day'>> & {
    year?: number;
    month?: number;
    day?: number;
};
