import { PRODUCTS_URL, UPLOAD_URL, CATEGORY_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 Get products (with optional search keyword)
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: PRODUCTS_URL,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    // 🔹 Get single product by ID
    getProductById: builder.query({
      query: (productId) => `${PRODUCTS_URL}/${productId}`,
      providesTags: (result, error, productId) => [{ type: "Product", id: productId }],
    }),

    // 🔹 Get all products (optimized)
    allProducts: builder.query({
      query: (params = {}) => ({
        url: `${PRODUCTS_URL}/allProducts`,
        params: {
          limit: params.limit || 0, // 0 means no limit
          page: params.page || 1,
          sort: params.sort || 'createdAt',
          order: params.order || 'desc'
        }
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
      providesTags: ['Product'],
    }),

    // 🔹 Get product details
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // 🔹 Create product
    createProduct: builder.mutation({
      query: (formData) => ({
        url: PRODUCTS_URL,
        method: "POST",
        body: formData, // ✅ send as multipart/form-data
      }),
    }),
    fetchCategories: builder.query({
      query: () => CATEGORY_URL,
    }),

    // 🔹 Update product
    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "PUT",
        body: formData,
        headers: formData instanceof FormData ? {} : { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Product"],
    }),

    // 🔹 Upload product image
    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: formData,
      }),
    }),

    // 🔹 Delete product
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // 🔹 Create review
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),

    // 🔹 Get top products
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    // 🔹 Get new products
    getNewProducts: builder.query({
      query: () => `${PRODUCTS_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    // 🔹 Filtered products (category, price)
    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCTS_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAllProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useGetFilteredProductsQuery,
} = productApiSlice;
