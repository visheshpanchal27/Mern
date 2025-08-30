import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
          query: (order) => ({
            url: ORDERS_URL,
            method: "POST",
            body: order,
          }),
          invalidatesTags: ['Order'],
        }),

        getOrderDetails: builder.query({
            query: (id) => ({
              url: `${ORDERS_URL}/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),

        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
              url: `${ORDERS_URL}/${orderId}/pay`,
              method: "PUT",
              body: details,
            }),
            invalidatesTags: (result, error, { orderId }) => [
              'Order',
              { type: 'Order', id: orderId }
            ],
        }),

        getPaypalClientId: builder.query({
            query: () => ({
              url: PAYPAL_URL,
            }),
        }),

        getMyOrders: builder.query({
            query: () => ({
              url: `${ORDERS_URL}/mine`,
            }),
            keepUnusedDataFor: 5,
            providesTags: (result) => {
              const orders = Array.isArray(result) ? result : [];
              return [
                'Order',
                ...orders.map(({ _id }) => ({ type: 'Order', id: _id }))
              ];
            },
        }),
      
        getOrders: builder.query({
            query: () => ({
              url: ORDERS_URL,
            }),
            providesTags: (result) => {
              const orders = Array.isArray(result) ? result : [];
              return [
                'Order',
                ...orders.map(({ _id }) => ({ type: 'Order', id: _id }))
              ];
            },
        }),

        deliverOrder: builder.mutation({
            query: (orderId) => ({
              url: `${ORDERS_URL}/${orderId}/deliver`,
              method: "PUT",
            }),
            invalidatesTags: (result, error, orderId) => [
              'Order',
              { type: 'Order', id: orderId }
            ],
        }),
      
        getTotalOrders: builder.query({
            query: () => `${ORDERS_URL}/total-orders`,
            providesTags: ['Order'],
        }),
      
        getTotalSales: builder.query({
            query: () => `${ORDERS_URL}/total-sales`,
            providesTags: ['Order'],
        }),
      
        getTotalSalesByDate: builder.query({
            query: () => `${ORDERS_URL}/total-sales-by-date`,
            providesTags: ['Order'],
        }),

        deleteOrder: builder.mutation({
          query: (orderId) => ({
            url: `${ORDERS_URL}/${orderId}`,
            method: "DELETE",
          }),
          invalidatesTags: (result, error, orderId) => [
            'Order',
            { type: 'Order', id: orderId }
          ],
        }),

        getOrderByTrackingId: builder.query({
          query: (trackingId) => `${ORDERS_URL}/track/${trackingId}`,
          providesTags: (result, error, trackingId) => [{ type: 'Order', id: trackingId }],
        }),

    }),
});

export const {
    useGetTotalOrdersQuery,
    useGetTotalSalesQuery,
    useGetTotalSalesByDateQuery,
    // ------------------
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useGetMyOrdersQuery,
    useDeliverOrderMutation,
    useGetOrdersQuery,
    useDeleteOrderMutation,
    useGetOrderByTrackingIdQuery,
  } = orderApiSlice;
