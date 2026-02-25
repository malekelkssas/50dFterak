import { configureStore, combineReducers, type Reducer } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { ENV } from '@/utils/constants';

import counterReducer from './slices/counterSlice';

const rootReducer = combineReducers({
    counter: counterReducer,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['counter'], // Only persist the counter slice
    transforms: [
        encryptTransform({
            secretKey: ENV.REDUX_PERSIST_SECRET_KEY || 'fallback-dev-secret',
            onError: (error) => {
                console.error('Redux Persist Encryption Error:', error);
            },
        }),
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer as unknown as Reducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            // immutableCheck: true, // Disabling conditional check to avoid process TS errors
        }),
    devTools: true,
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
