// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usa localStorage per la persistenza
import userReducer  from '../reducers/authSlice';

// Configurazione per la persistenza
const persistConfig = {
    key: 'root',
    storage,
};

// Crea il reducer persistente
const persistedReducer = persistReducer(persistConfig, userReducer );

// Crea lo store
const store = configureStore({
    reducer: {
        auth: persistedReducer,
    },
});

// Crea il persistor
const persistor = persistStore(store);

export { store, persistor };