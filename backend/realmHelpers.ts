import type { User } from './models/User';
import type { Order } from './models/Order';
import type { Invoice } from './models/Invoice';

// ── Plain (non-proxy) types ────────────────────────────────────────

export type PlainUser = {
    _id: string;
    name: string;
    phoneNumber: string;
    flourAmount: number;
    createdAt: Date;
};

export type PlainOrder = {
    _id: string;
    createdAt: Date;
    day: number;
    month: number;
    year: number;
    flourAmount: number;
    doneAt: Date | null;
    user: PlainUser | null;
};

export type PlainInvoice = {
    _id: string;
    year: number;
    month: number;
    day: number;
    time?: string;
    title: string;
    description?: string;
    price: number;
    quantity: number;
    createdAt: Date;
};

// ── Converters (Realm proxy → plain JS snapshot) ───────────────────

export function toPlainUser(user: User): PlainUser {
    return {
        _id: user._id.toHexString(),
        name: user.name,
        phoneNumber: user.phoneNumber,
        flourAmount: user.flourAmount,
        createdAt: user.createdAt,
    };
}

export function toPlainOrder(order: Order): PlainOrder {
    const user = order.user;
    return {
        _id: order._id.toHexString(),
        createdAt: order.createdAt,
        day: order.day,
        month: order.month,
        year: order.year,
        flourAmount: order.flourAmount,
        doneAt: order.doneAt,
        user: user && user.isValid() ? toPlainUser(user) : null,
    };
}

export function toPlainInvoice(invoice: Invoice): PlainInvoice {
    return {
        _id: invoice._id.toHexString(),
        year: invoice.year,
        month: invoice.month,
        day: invoice.day,
        time: invoice.time,
        title: invoice.title,
        description: invoice.description,
        price: invoice.price,
        quantity: invoice.quantity,
        createdAt: invoice.createdAt,
    };
}
