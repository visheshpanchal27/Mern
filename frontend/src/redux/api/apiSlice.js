import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'https://mernbackend-tmp5.onrender.com/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('webToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('x-client-type', 'web');
      return headers;
    },
  }),
  tagTypes: ['Product', 'Order', 'User', 'Category', 'Cart', 'Wishlist'],
  endpoints: (builder) => ({}),
});