import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice';
import { toast } from 'react-toastify';
import AdminMenu from './AdminMenu';
import Button from '@mui/material/Button';

const initialFormState = {
  name: '',
  description: '',
  price: '',
  category: '',
  quantity: '',
  brand: '',
  stock: '',
};

const ProductList = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);

  const navigate = useNavigate();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImageHandler = () => {
    setImage(null);
    setImagePreview('');
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { name, description, price, category, quantity, brand, stock } = formData;

    if (!name || !description || !price || !category || !quantity || !brand || !stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!image) {
      toast.error('Please select an image');
      return;
    }

    try {
      setCreatingProduct(true);

      setUploading(true);
      const uploadForm = new FormData();
      uploadForm.append('image', image);
      const uploadRes = await uploadProductImage(uploadForm).unwrap();
      const uploadedImageUrl = uploadRes.image;
      setUploading(false);

      const productData = {
        name,
        description,
        price,
        category,
        quantity,
        brand,
        countInStock: stock,
        image: uploadedImageUrl,
      };

      await createProduct(productData).unwrap();
      toast.success('Product created successfully!');
      setFormData(initialFormState);
      setImage(null);
      setImagePreview('');
      navigate('/');
    } catch (err) {
      console.error('❌ Product Error:', err);
      toast.error(err?.data?.message || err?.message || 'Failed to create product');
    } finally {
      setCreatingProduct(false);
      setUploading(false);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0] text-white">
      <AdminMenu />
      <form onSubmit={submitHandler} className="flex flex-col md:flex-row">
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-xl font-semibold mb-6">Create Product</div>

          {/* Image Preview and Upload */}
          <div className="mb-8 relative">
            {imagePreview && (
              <div className="text-center mb-4 relative">
                <img
                  src={imagePreview}
                  alt="product preview"
                  className="block mx-auto max-h-[200px] rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={removeImageHandler}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600 transition"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            )}
            <label
              className={`border px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 border-gray-700 hover:border-pink-500 transition ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {image ? 'Change Image' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { label: 'Name', id: 'name', type: 'text' },
              { label: 'Price', id: 'price', type: 'number' },
              { label: 'Quantity', id: 'quantity', type: 'number' },
              { label: 'Brand', id: 'brand', type: 'text' },
              { label: 'Stock', id: 'stock', type: 'number' },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
                />
              </div>
            ))}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
            <textarea
              id="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011] resize-none"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={uploading || creatingProduct}
              sx={{
                bgcolor: '#ec4899',
                '&:hover': { bgcolor: '#db2777' },
              }}
            >
              {uploading
                ? 'Uploading Image...'
                : creatingProduct
                ? 'Creating Product...'
                : 'Submit Product'}
            </Button>

            <Button
              type="button"
              variant="outlined"
              color="secondary"
              fullWidth
              disabled={creatingProduct}
              onClick={() => navigate(-1)} // or use navigate('/') or reset form
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductList;
