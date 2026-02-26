import { BSON } from 'realm';
import { getRealm } from '../realm';
import { Order } from '../models/Order';
import { User } from '../models/User';

class OrderService {
    private static instance: OrderService;

    private constructor() { }

    static getInstance(): OrderService {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    /**
     * Get all orders for a specific date.
     * Defaults to today if year/month/day are not provided.
     */
    getOrders(year?: number, month?: number, day?: number): Order[] {
        const realm = getRealm();
        const now = new Date();

        const targetYear = year ?? now.getFullYear();
        const targetMonth = month ?? now.getMonth() + 1;
        const targetDay = day ?? now.getDate();

        const results = realm
            .objects(Order)
            .filtered(
                'year == $0 AND month == $1 AND day == $2',
                targetYear,
                targetMonth,
                targetDay,
            )
            .sorted('createdAt', true); // newest first

        return [...results];
    }

    /**
     * Create a new order linked to a specific user.
     */
    addOrder(data: {
        day: number;
        month: number;
        year: number;
        flourAmount: number;
        user: User;
    }): Order {
        const realm = getRealm();
        let order!: Order;

        realm.write(() => {
            order = realm.create(Order, {
                _id: new BSON.ObjectId(),
                createdAt: new Date(),
                day: data.day,
                month: data.month,
                year: data.year,
                flourAmount: data.flourAmount,
                user: data.user,
            });
        });

        return order;
    }

    /**
     * Get orders for a specific user, sorted by createdAt descending. Supports cursor-based pagination.
     */
    getOrdersByUser(
        userId: BSON.ObjectId | string,
        cursor?: Date,
        limit: number = 20,
    ): { orders: Order[]; nextCursor: Date | null } {
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

        return { orders, nextCursor };
    }

    /**
     * Toggle the done status of an order.
     * If `doneAt` is null → sets it to now (marks as done). Deducts flour from user.
     * If `doneAt` is set → sets it to null (marks as not done). Refunds flour to user.
     */
    toggleDone(id: BSON.ObjectId | string): Order {
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

        return order;
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
}

export const orderService = OrderService.getInstance();
