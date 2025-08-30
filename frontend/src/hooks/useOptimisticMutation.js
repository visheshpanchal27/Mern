import { useDispatch } from 'react-redux';
import { apiSlice } from '../redux/api/apiSlice';

export const useOptimisticMutation = () => {
  const dispatch = useDispatch();

  const updateProductOptimistically = (productId, updates, mutation) => {
    // Optimistic update
    dispatch(
      apiSlice.util.updateQueryData('getProductById', productId, (draft) => {
        Object.assign(draft, updates);
      })
    );
    
    dispatch(
      apiSlice.util.updateQueryData('allProducts', undefined, (draft) => {
        const products = Array.isArray(draft) ? draft : draft?.products || [];
        const product = products.find(p => p._id === productId);
        if (product) {
          Object.assign(product, updates);
        }
      })
    );

    // Execute actual mutation
    return mutation.unwrap().catch(() => {
      // Revert on error
      dispatch(apiSlice.util.invalidateTags(['Product']));
    });
  };

  const deleteProductOptimistically = (productId, mutation) => {
    // Optimistic delete
    dispatch(
      apiSlice.util.updateQueryData('allProducts', undefined, (draft) => {
        const products = Array.isArray(draft) ? draft : draft?.products || [];
        return products.filter(p => p._id !== productId);
      })
    );

    // Execute actual mutation
    return mutation.unwrap().catch(() => {
      // Revert on error
      dispatch(apiSlice.util.invalidateTags(['Product']));
    });
  };

  const updateCategoryOptimistically = (categoryId, updates, mutation) => {
    // Optimistic update
    dispatch(
      apiSlice.util.updateQueryData('fetchCategories', undefined, (draft) => {
        const categories = Array.isArray(draft) ? draft : [];
        const category = categories.find(c => c._id === categoryId);
        if (category) {
          Object.assign(category, updates);
        }
      })
    );

    // Execute actual mutation
    return mutation.unwrap().catch(() => {
      // Revert on error
      dispatch(apiSlice.util.invalidateTags(['Category']));
    });
  };

  return {
    updateProductOptimistically,
    deleteProductOptimistically,
    updateCategoryOptimistically
  };
};