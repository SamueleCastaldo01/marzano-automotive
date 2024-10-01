// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usa localStorage per la persistenza
import authReducer from '../reducers/authSlice'; // Importa il reducer per l'autenticazione generale
import userAuthReducer from '../reducers/userAuthSlice'; // Importa il nuovo reducer per l'autenticazione utente

// Configurazione per la persistenza
const persistConfig = {
    key: 'root',
    storage,
};

// Crea i reducers persistenti
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedUserAuthReducer = persistReducer(persistConfig, userAuthReducer);

// Crea lo store
const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        userAuth: persistedUserAuthReducer, // Aggiungi il nuovo reducer per l'autenticazione utente
    },
});

// Crea il persistor
const persistor = persistStore(store);

export { store, persistor };
