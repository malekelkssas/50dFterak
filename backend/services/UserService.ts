import { BSON } from 'realm';
import { getRealm } from '../realm';
import { User, UserData, UserUpdateData } from '../models/User';

const PAGE_SIZE = 20;

class UserService {
    private static instance: UserService;

    private constructor() { }

    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    /**
     * Get users with cursor-based pagination.
     * Cursor is based on `createdAt` (descending — newest first).
     * Supports partial, case-insensitive search by name or phone number.
     */
    getUsers(
        cursor?: Date,
        limit: number = PAGE_SIZE,
        search?: string,
    ): { users: User[]; nextCursor: Date | null } {
        const realm = getRealm();

        let results = realm.objects(User);

        // Filter by cursor (get users created before the cursor date)
        if (cursor) {
            results = results.filtered('createdAt < $0', cursor);
        }

        // Search by name or phone number (case-insensitive, partial match)
        if (search && search.trim().length > 0) {
            const term = search.trim();
            results = results.filtered(
                'name CONTAINS[c] $0 OR phoneNumber CONTAINS[c] $0',
                term,
            );
        }

        // Sort by createdAt descending (newest first)
        const sorted = results.sorted('createdAt', true);

        // Take only `limit` items
        const users = [...sorted.slice(0, limit)];

        // Determine next cursor
        const nextCursor =
            users.length === limit
                ? users[users.length - 1].createdAt
                : null;

        return { users, nextCursor };
    }

    /**
     * Get a single user by its _id using primary key lookup.
     */
    getUserById(id: BSON.ObjectId | string): User | null {
        const realm = getRealm();
        const objectId =
            typeof id === 'string' ? new BSON.ObjectId(id) : id;
        return realm.objectForPrimaryKey(User, objectId);
    }

    /**
     * Create a new user.
     */
    addUser(data: UserData): User {
        const realm = getRealm();
        let user!: User;

        realm.write(() => {
            user = realm.create(User, {
                _id: new BSON.ObjectId(),
                name: data.name,
                phoneNumber: data.phoneNumber,
                flourAmount: data.flourAmount,
                createdAt: new Date(),
            });
        });

        return user;
    }

    /**
     * Update an existing user by its _id.
     * Only the fields present in `data` will be updated.
     */
    updateUser(
        id: BSON.ObjectId | string,
        data: UserUpdateData,
    ): User {
        const realm = getRealm();
        const objectId =
            typeof id === 'string' ? new BSON.ObjectId(id) : id;

        const user = realm.objectForPrimaryKey(User, objectId);

        if (!user) {
            throw new Error(`User with id ${objectId.toHexString()} not found`);
        }

        realm.write(() => {
            if (data.name !== undefined) {
                user.name = data.name;
            }
            if (data.phoneNumber !== undefined) {
                user.phoneNumber = data.phoneNumber;
            }
            if (data.flourAmount !== undefined) {
                user.flourAmount = data.flourAmount;
            }
        });

        return user;
    }

    /**
     * Delete an existing user by its _id, along with all associated orders.
     */
    deleteUser(id: BSON.ObjectId | string): void {
        const realm = getRealm();
        const objectId =
            typeof id === 'string' ? new BSON.ObjectId(id) : id;

        const user = realm.objectForPrimaryKey(User, objectId);

        if (!user) {
            throw new Error(`User with id ${objectId.toHexString()} not found`);
        }

        // Must delete associated orders first
        const orders = realm.objects("Order").filtered('user == $0', user);

        realm.write(() => {
            realm.delete(orders);
            realm.delete(user);
        });
    }
}

export const userService = UserService.getInstance();
