import { apiSlice } from "./apiSlice"; 

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `/cart`,
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (item) => ({
        url: `/cart`,
        method: "POST",
        body: { productId: item._id, quantity: item.qty },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation({
      query: (items) => ({
        url: `/cart`,
        method: "PUT",
        body: { items },
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `/cart`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useClearCartMutation,
} = cartApiSlice;
