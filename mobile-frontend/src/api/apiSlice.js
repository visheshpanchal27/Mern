import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'https://mernbackend-tmp5.onrender.com/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('mobileToken')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('x-client-type', 'mobile');
    return headers
  },
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'User', 'Order', 'Category', 'Cart'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query({
      query: ({ page = 1, limit = 20, search = '', category = '' }) => 
        `products?page=${page}&limit=${limit}&search=${search}&category=${category}`,
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
      providesTags: ['Product'],
    }),
    
    // Categories
    getCategories: builder.query({
      query: () => 'categories',
      providesTags: ['Category'],
    }),
    
    // Auth
    login: builder.mutation({
      query: (data) => ({
        url: 'users/auth',
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: 'users',
        method: 'POST',
        body: data,
      }),
    }),
    
    // Cart
    getCart: builder.query({
      query: () => 'cart',
      providesTags: ['Cart'],
    }),
    updateCart: builder.mutation({
      query: (items) => ({
        url: 'cart',
        method: 'PUT',
        body: { items },
      }),
      invalidatesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity = 1 }) => ({
        url: 'cart',
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: 'cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Orders
    createOrder: builder.mutation({
      query: (data) => ({
        url: 'orders',
        method: 'POST',
        body: data,
      }),
    }),
    createBuyNowOrder: builder.mutation({
      query: (data) => ({
        url: 'orders/buy-now',
        method: 'POST',
        body: data,
      }),
    }),
    
    // User Profile
    getProfile: builder.query({
      query: () => 'users/profile',
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: 'users/logout',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useLoginMutation,
  useRegisterMutation,
  useGetCartQuery,
  useUpdateCartMutation,
  useAddToCartMutation,
  useClearCartMutation,
  useCreateOrderMutation,
  useCreateBuyNowOrderMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = apiSlice