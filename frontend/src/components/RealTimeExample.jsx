import { useState } from 'react';
import { useAllProductsQuery, useUpdateProductMutation } from '../redux/api/productApiSlice';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';
import { useOptimisticMutation } from '../hooks/useOptimisticMutation';
import { useEnhancedMutation } from '../hooks/useEnhancedMutation';
import RefreshButton from './RefreshButton';

const RealTimeExample = () => {
  const { data: products, isLoading } = useAllProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const { refreshProducts } = useRealTimeUpdates();
  const { updateProductOptimistically } = useOptimisticMutation();
  const [enhancedUpdate, { isLoading: isUpdating }] = useEnhancedMutation(
    updateProduct,
    {
      successMessage: 'Product updated successfully!',
      errorMessage: 'Failed to update product'
    }
  );

  const [editingProduct, setEditingProduct] = useState(null);
  const [newName, setNewName] = useState('');

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setNewName(product.name);
  };

  const handleUpdate = async (productId) => {
    try {
      // Option 1: Regular update with cache invalidation
      await enhancedUpdate({ 
        productId, 
        formData: new FormData().append('name', newName) 
      });

      // Option 2: Optimistic update (uncomment to use instead)
      // await updateProductOptimistically(
      //   productId,
      //   { name: newName },
      //   updateProduct({ productId, formData: new FormData().append('name', newName) })
      // );

      setEditingProduct(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Real-Time Products</h2>
        <div className="flex gap-2">
          <RefreshButton type="products" />
          <button 
            onClick={refreshProducts}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Manual Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {products?.slice(0, 5).map(product => (
          <div key={product._id} className="p-4 bg-gray-800 rounded">
            {editingProduct === product._id ? (
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 rounded"
                />
                <button
                  onClick={() => handleUpdate(product._id)}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-400">${product.price}</p>
                </div>
                <button
                  onClick={() => handleEdit(product)}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded">
        <h3 className="font-semibold mb-2">Real-Time Features Active:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>✅ Automatic cache invalidation on mutations</li>
          <li>✅ Optimistic updates for immediate feedback</li>
          <li>✅ Auto-refresh when returning to tab</li>
          <li>✅ Manual refresh buttons</li>
          <li>✅ Enhanced error handling with rollback</li>
        </ul>
      </div>
    </div>
  );
};

export default RealTimeExample;