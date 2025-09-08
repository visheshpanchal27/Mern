import { apiSlice } from "./apiSlice";

export const randomProductsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRandomProducts: builder.query({
      query: (limit = 10) => `products`,
      transformResponse: (response) => {
        // Shuffle the products on frontend since backend random endpoint doesn't exist
        const products = response.products || response;
        const shuffled = [...products].sort(() => Math.random() - 0.5);
        return {
          products: shuffled.slice(0, limit),
          count: shuffled.slice(0, limit).length,
          limit: limit,
          timestamp: new Date().toISOString()
        };
      },
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetRandomProductsQuery } = randomProductsApiSlice;