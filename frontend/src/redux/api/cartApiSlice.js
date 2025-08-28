import { apiSlice } from "./apiSlice"; 

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `api/cart`,
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (item) => ({
        url: `api/cart`,
        method: "POST",
        body: { productId: item._id, quantity: item.qty },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation({
      query: (items) => ({
        url: `api/cart`,
        method: "PUT",
        body: { items },
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `api/cart`,
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
