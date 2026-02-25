import { BSON } from 'realm';
import { getRealm } from '../realm';
import { Invoice, InvoiceData, InvoiceUpdateData } from '../models/Invoice';

class InvoiceService {
    private static instance: InvoiceService;

    private constructor() { }

    static getInstance(): InvoiceService {
        if (!InvoiceService.instance) {
            InvoiceService.instance = new InvoiceService();
        }
        return InvoiceService.instance;
    }

    /**
     * Get the day numbers that have at least one invoice in a given month.
     * Useful for showing badges on a calendar.
     */
    getDaysWithInvoices(year: number, month: number): number[] {
        const realm = getRealm();
        const invoices = realm
            .objects(Invoice)
            .filtered('year == $0 AND month == $1', year, month);

        const days = new Set<number>();
        for (const inv of invoices) {
            days.add(inv.day);
        }
        return Array.from(days).sort((a, b) => a - b);
    }

    /**
     * Get invoices for a specific year, month, and day.
     * If day is omitted, defaults to today's day.
     */
    getInvoices(year: number, month: number, day?: number): Invoice[] {
        const realm = getRealm();
        const targetDay = day ?? new Date().getDate();

        const results = realm
            .objects(Invoice)
            .filtered(
                'year == $0 AND month == $1 AND day == $2',
                year,
                month,
                targetDay,
            )
            .sorted('createdAt', true); // true = descending (newest first)

        return [...results];
    }

    /**
     * Calculate total amount for a specific date
     */
    getTotalAmountForDate(year: number, month: number, day?: number): number {
        const invoices = this.getInvoices(year, month, day);
        return invoices.reduce((sum, inv) => sum + (inv.price * (inv.quantity || 1)), 0);
    }

    /**
     * Create a new invoice.
     */
    addInvoice(data: InvoiceData): Invoice {
        const realm = getRealm();
        let invoice!: Invoice;

        realm.write(() => {
            invoice = realm.create(Invoice, {
                _id: new BSON.ObjectId(),
                year: data.year,
                month: data.month,
                day: data.day,
                time: data.time,
                title: data.title,
                description: data.description,
                price: data.price,
                quantity: data.quantity ?? 1,
                createdAt: new Date(),
            });
        });

        return invoice;
    }

    /**
     * Update an existing invoice by its _id.
     * Only the fields present in `data` will be updated.
     */
    updateInvoice(
        id: BSON.ObjectId | string,
        data: InvoiceUpdateData,
    ): Invoice {
        const realm = getRealm();
        const objectId =
            typeof id === 'string' ? new BSON.ObjectId(id) : id;

        const invoice = realm.objectForPrimaryKey(Invoice, objectId);

        if (!invoice) {
            throw new Error(`Invoice with id ${objectId.toHexString()} not found`);
        }

        realm.write(() => {
            if (data.year !== undefined) {
                invoice.year = data.year;
            }
            if (data.month !== undefined) {
                invoice.month = data.month;
            }
            if (data.day !== undefined) {
                invoice.day = data.day;
            }
            if (data.time !== undefined) {
                invoice.time = data.time;
            }
            if (data.title !== undefined) {
                invoice.title = data.title;
            }
            if (data.description !== undefined) {
                invoice.description = data.description;
            }
            if (data.price !== undefined) {
                invoice.price = data.price;
            }
            if (data.quantity !== undefined) {
                invoice.quantity = data.quantity;
            }
        });

        return invoice;
    }

    /**
     * Delete an invoice by its _id.
     */
    deleteInvoice(id: BSON.ObjectId | string): void {
        const realm = getRealm();
        const objectId = typeof id === 'string' ? new BSON.ObjectId(id) : id;

        const invoice = realm.objectForPrimaryKey(Invoice, objectId);

        if (invoice) {
            realm.write(() => {
                realm.delete(invoice);
            });
        }
    }
}

export const invoiceService = InvoiceService.getInstance();
