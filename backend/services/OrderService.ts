import { BSON } from 'realm';
import { getRealm } from '../realm';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { toPlainOrder, PlainOrder } from '../realmHelpers';

class OrderService {
    private static instance: OrderService;

    private constructor() { }

    static getInstance(): OrderService {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    getOrders(
        year?: number,
        month?: number,
        day?: number,
        cursor?: Date,
        limit: number = 20
    ): { orders: PlainOrder[]; nextCursor: Date | null } {
        const realm = getRealm();
        const now = new Date();

        const targetYear = year ?? now.getFullYear();
        const targetMonth = month ?? now.getMonth() + 1;
        const targetDay = day ?? now.getDate();

        let results = realm
            .objects(Order)
            .filtered(
                'year == $0 AND month == $1 AND day == $2',
                targetYear,
                targetMonth,
                targetDay,
            );

        if (cursor) {
            results = results.filtered('createdAt < $0', cursor);
        }

        const sorted = results.sorted('createdAt', true); // newest first
        const orders = [...sorted.slice(0, limit)];

        const nextCursor =
            orders.length === limit
                ? orders[orders.length - 1].createdAt
                : null;

        return { orders: orders.map(toPlainOrder), nextCursor };
    }

    /**
     * Create a new order linked to a specific user (by userId string).
     */
    addOrder(data: {
        day: number;
        month: number;
        year: number;
        flourAmount: number;
        userId: string;
    }): PlainOrder {
        const realm = getRealm();
        const objectId = new BSON.ObjectId(data.userId);
        const user = realm.objectForPrimaryKey(User, objectId);

        if (!user) {
            throw new Error(`User with id ${data.userId} not found`);
        }

        let order!: Order;

        realm.write(() => {
            order = realm.create(Order, {
                _id: new BSON.ObjectId(),
                createdAt: new Date(),
                day: data.day,
                month: data.month,
                year: data.year,
                flourAmount: data.flourAmount,
                user: user,
            });
        });

        return toPlainOrder(order);
    }

    /**
     * Get orders for a specific user, sorted by createdAt descending. Supports cursor-based pagination.
     */
    getOrdersByUser(
        userId: BSON.ObjectId | string,
        cursor?: Date,
        limit: number = 20,
    ): { orders: PlainOrder[]; nextCursor: Date | null } {
        const realm = getRealm();
        const objectId =
            typeof userId === 'string' ? new BSON.ObjectId(userId) : userId;

        const user = realm.objectForPrimaryKey(User, objectId);

        if (!user) {
            throw new Error(`User with id ${objectId.toHexString()} not found`);
        }

        let results = realm
            .objects(Order)
            .filtered('user == $0', user);

        if (cursor) {
            results = results.filtered('createdAt < $0', cursor);
        }

        const sorted = results.sorted('createdAt', true);

        const orders = [...sorted.slice(0, limit)];

        const nextCursor =
            orders.length === limit
                ? orders[orders.length - 1].createdAt
                : null;

        return { orders: orders.map(toPlainOrder), nextCursor };
    }

    /**
     * Toggle the done status of an order.
     * If `doneAt` is null → sets it to now (marks as done). Deducts flour from user.
     * If `doneAt` is set → sets it to null (marks as not done). Refunds flour to user.
     */
    toggleDone(id: BSON.ObjectId | string): PlainOrder {
        const realm = getRealm();
        const objectId =
            typeof id === 'string' ? new BSON.ObjectId(id) : id;

        const order = realm.objectForPrimaryKey(Order, objectId);

        if (!order) {
            throw new Error(`Order with id ${objectId.toHexString()} not found`);
        }

        realm.write(() => {
            const wasDone = !!order.doneAt;

            // Toggle the status
            order.doneAt = wasDone ? null : new Date();

            // Update the user's flour balance
            if (wasDone) {
                // Changing from done -> pending: refund the balance
                order.user.flourAmount += order.flourAmount;
            } else {
                // Changing from pending -> done: deduct the balance
                order.user.flourAmount -= order.flourAmount;
            }
        });

        return toPlainOrder(order);
    }

    /**
     * Delete an order.
     * If the order was marked as done, it refunds the user's flour balance before deleting.
     */
    deleteOrder(id: BSON.ObjectId | string): void {
        const realm = getRealm();
        const objectId =
            typeof id === 'string' ? new BSON.ObjectId(id) : id;

        const order = realm.objectForPrimaryKey(Order, objectId);

        if (!order) {
            throw new Error(`Order with id ${objectId.toHexString()} not found`);
        }

        realm.write(() => {
            // If the order was done, refund the flour back to the user's balance
            if (order.doneAt && order.user && order.user.isValid()) {
                order.user.flourAmount += order.flourAmount;
            }

            // Finally, delete the order
            realm.delete(order);
        });
    }

    /**
     * Get the total pending flour amount for a user (sum of orders that are not done).
     */
    getPendingFlourAmountByUser(userId: BSON.ObjectId | string): number {
        const realm = getRealm();
        const objectId =
            typeof userId === 'string' ? new BSON.ObjectId(userId) : userId;

        const user = realm.objectForPrimaryKey(User, objectId);

        if (!user) {
            throw new Error(`User with id ${objectId.toHexString()} not found`);
        }

        const pendingOrders = realm
            .objects(Order)
            .filtered('user == $0 AND doneAt == null', user);

        let totalPending = 0;
        for (const order of pendingOrders) {
            totalPending += order.flourAmount;
        }

        return totalPending;
    }

    /**
     * Get the days within a given week that have at least one order.
     * Returns an array of day-of-month numbers for each date with orders.
     * Handles the edge case where a week spans two different months/years
     * by querying each day individually.
     *
     * @param weekStart - The Date representing the start of the week (Saturday).
     * @returns An array of `{ day, month, year }` objects for days that have orders.
     */
    getOrderDaysInWeek(weekStart: Date): { day: number; month: number; year: number }[] {
        const realm = getRealm();
        const result: { day: number; month: number; year: number }[] = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);

            const day = d.getDate();
            const month = d.getMonth() + 1;
            const year = d.getFullYear();

            const count = realm
                .objects(Order)
                .filtered(
                    'year == $0 AND month == $1 AND day == $2 AND doneAt == null',
                    year,
                    month,
                    day,
                ).length;

            if (count > 0) {
                result.push({ day, month, year });
            }
        }

        return result;
    }
}

export const orderService = OrderService.getInstance();
