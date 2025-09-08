import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";


export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query:(newCategory)=>({
                url: `${CATEGORY_URL}`,
                method: 'post',
                body: newCategory,
            }),
            invalidatesTags: ['Category', 'Product'],
        }),

        updateCategory:builder.mutation({
            query:({categoryId,updatedCategory})=>({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: 'put',
                body: updatedCategory
            }),
            invalidatesTags: (result, error, { categoryId }) => [
                'Category',
                { type: 'Category', id: categoryId },
                'Product'
            ],
        }),

        deleteCategory: builder.mutation({
            query:({categoryId})=>({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: 'delete',
            }),
            invalidatesTags: (result, error, { categoryId }) => [
                'Category',
                { type: 'Category', id: categoryId },
                'Product'
            ],
        }),

        fetchCategories: builder.query({
            query: ()=>`${CATEGORY_URL}`,
            providesTags: (result) => [
                'Category',
                ...(result || []).map(({ _id }) => ({ type: 'Category', id: _id }))
            ],
        }),
    }),
});

export const {
    useCreateCategoryMutation,  
    useUpdateCategoryMutation, 
    useDeleteCategoryMutation, 
    useFetchCategoriesQuery,  
} = categoryApiSlice;