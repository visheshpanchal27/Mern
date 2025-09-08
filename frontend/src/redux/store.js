import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import { authReducer, logOut } from "./features/auth/authSlice";
import favoriteReducer from "./features/favorites/favoriteSlice";
import  cartSliceReducer  from "./features/Cart/CartSlice";  
import shopReducer from "./features/Shop/shopSlice"
import { getFavoritesFromLocalStorage } from "../Utils/localStorage";
import orderReducer from "./features/Orders/orderSlice";


const initialFavorites = getFavoritesFromLocalStorage() || [];

const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]:apiSlice.reducer,
        auth:authReducer,
        favorites: favoriteReducer,
        cart:cartSliceReducer,
        shop:shopReducer,
        orderCreate: orderReducer,
    },

    preloadedState: {
        favorites: initialFavorites,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register']
            },
            immutableCheck: { warnAfter: 128 },
            serializableCheck: { warnAfter: 128 }
        }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export default store;