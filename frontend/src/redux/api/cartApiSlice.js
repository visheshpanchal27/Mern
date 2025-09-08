import { apiSlice } from "./apiSlice"; 

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => `cart`,
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (item) => ({
        url: `cart`,
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
        url: `cart`,
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
        url: `cart`,
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
