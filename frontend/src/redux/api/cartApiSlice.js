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
        body: { productId: item._id, quantity: item.qty || 1 },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Force refresh cart data after adding item
          dispatch(cartApiSlice.util.invalidateTags(["Cart"]));
        } catch (error) {
          console.error('Add to cart failed:', error);
        }
      },
    }),
    updateCart: builder.mutation({
      query: (items) => ({
        url: `api/cart`,
        method: "PUT",
        body: { items },
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(cartApiSlice.util.invalidateTags(["Cart"]));
        } catch {}
      },
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `api/cart`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Immediately update cache to show empty cart
          dispatch(cartApiSlice.util.updateQueryData('getCart', undefined, (draft) => {
            return { items: [] };
          }));
          dispatch(cartApiSlice.util.invalidateTags(["Cart"]));
        } catch (error) {
          console.error('Clear cart failed:', error);
        }
      },
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useClearCartMutation,
} = cartApiSlice;
