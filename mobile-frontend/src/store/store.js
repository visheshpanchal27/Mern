import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'
import authSlice from './authSlice'
import cartSlice from './cartSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    cart: cartSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

// No sync - mobile and PC are completely separate