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
      providesTags: (result) => {
        const products = result?.products || result || [];
        return [
          'Product',
          { type: 'Product', id: 'LIST' },
          ...(Array.isArray(products) ? products.map(({ _id }) => ({ type: 'Product', id: _id })) : [])
        ];
      },
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
          sort: params.sort || 'createdAt',
          order: params.order || 'desc'
        }
      }),
      keepUnusedDataFor: 30,
      providesTags: (result) => {
        const products = result?.products || result || [];
        return [
          'Product',
          { type: 'Product', id: 'LIST' },
          ...(Array.isArray(products) ? products.map(({ _id }) => ({ type: 'Product', id: _id })) : [])
        ];
      },
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
      invalidatesTags: ['Product'],
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
      invalidatesTags: (result, error, { productId }) => [
        'Product',
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' }
      ],
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
      invalidatesTags: (result, error, productId) => [
        'Product',
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' }
      ],
    }),

    // 🔹 Create review
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        'Product'
      ],
    }),

    // 🔹 Get top products
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),

    // 🔹 Get new products
    getNewProducts: builder.query({
      query: () => `${PRODUCTS_URL}/new`,
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
    }),

    // 🔹 Filtered products (category, price)
    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCTS_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
      providesTags: ['Product'],
    }),

    // 🔹 Search products
    searchProducts: builder.query({
      query: (searchTerm) => `${PRODUCTS_URL}/search?q=${encodeURIComponent(searchTerm)}`,
      keepUnusedDataFor: 5,
      providesTags: ['Product'],
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
  useSearchProductsQuery,
} = productApiSlice;
