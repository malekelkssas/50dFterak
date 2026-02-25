import { REDUX_PERSIST_SECRET_KEY } from '@env';

/**
 * Centralized environment variables object.
 * Imports from the '@env' module provided by react-native-dotenv.
 */
export const ENV = {
    REDUX_PERSIST_SECRET_KEY,
} as const;
