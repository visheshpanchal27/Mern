import { apiSlice } from './apiSlice'

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrderByTrackingId: builder.query({
      query: (trackingId) => `orders/track/${trackingId}`,
      providesTags: ['Order'],
    }),
  }),
})

export const { useGetOrderByTrackingIdQuery } = orderApiSlice