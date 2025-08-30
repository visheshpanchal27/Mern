// Optimistic update utilities for immediate UI feedback

export const optimisticProductUpdate = (dispatch, apiSlice, productId, updates) => {
  // Optimistically update the product in cache
  dispatch(
    apiSlice.util.updateQueryData('getProductById', productId, (draft) => {
      Object.assign(draft, updates);
    })
  );
  
  dispatch(
    apiSlice.util.updateQueryData('allProducts', undefined, (draft) => {
      const product = draft?.find(p => p._id === productId);
      if (product) {
        Object.assign(product, updates);
      }
    })
  );
};

export const optimisticProductDelete = (dispatch, apiSlice, productId) => {
  // Optimistically remove product from cache
  dispatch(
    apiSlice.util.updateQueryData('allProducts', undefined, (draft) => {
      return draft?.filter(p => p._id !== productId) || [];
    })
  );
};

export const optimisticProductAdd = (dispatch, apiSlice, newProduct) => {
  // Optimistically add product to cache
  dispatch(
    apiSlice.util.updateQueryData('allProducts', undefined, (draft) => {
      return [newProduct, ...(draft || [])];
    })
  );
};

export const optimisticCategoryUpdate = (dispatch, apiSlice, categoryId, updates) => {
  dispatch(
    apiSlice.util.updateQueryData('fetchCategories', undefined, (draft) => {
      const category = draft?.find(c => c._id === categoryId);
      if (category) {
        Object.assign(category, updates);
      }
    })
  );
};

export const optimisticOrderUpdate = (dispatch, apiSlice, orderId, updates) => {
  dispatch(
    apiSlice.util.updateQueryData('getOrderDetails', orderId, (draft) => {
      Object.assign(draft, updates);
    })
  );
  
  dispatch(
    apiSlice.util.updateQueryData('getMyOrders', undefined, (draft) => {
      const order = draft?.find(o => o._id === orderId);
      if (order) {
        Object.assign(order, updates);
      }
    })
  );
};