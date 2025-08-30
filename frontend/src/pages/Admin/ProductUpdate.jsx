import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import MultiImageUpload from "../../components/MultiImageUpload";
import { useOptimisticMutation } from "../../hooks/useOptimisticMutation";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(id);
  const { data: categories = [], isLoading: catLoading, error: catError } = useFetchCategoriesQuery();2

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const { updateProductOptimistically, deleteProductOptimistically } = useOptimisticMutation();

useEffect(() => {
  if (!productData) return;

  setName(productData.name || "");
  setDescription(productData.description || "");
  setPrice(productData.price || "");
  setCategory(productData.category?._id || "");  // ✅ this sets existing category
  setQuantity(productData.quantity || "");
  setBrand(productData.brand || "");
  setCountInStock(productData.countInStock || "");

  if (productData.image) {
    setImagePreview(
      productData.image.startsWith("http")
        ? productData.image
        : `${import.meta.env.VITE_API_URL}${productData.image}`
    );
  }

  // Set additional images
  if (productData.images && productData.images.length > 0) {
    setAdditionalImages(productData.images);
  }
}, [productData]);

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
    setImagePreview("");
  };

  
const submitHandler = async (e) => {
  e.preventDefault();

  if (!name.trim() || !price || !category) {
    toast.error("⚠️ Please fill in all required fields: Name, Price, Category");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description?.trim() || "");
    formData.append("category", category.toString()); // ✅ ensure string
    formData.append("brand", brand?.trim() || "");
    formData.append("price", Number(price));
    formData.append("quantity", Number(quantity) || 0);
    formData.append("countInStock", Number(countInStock) || 0);

    if (image && image instanceof File) {
      formData.append("image", image);
    }

    // Add additional images info (they're already uploaded)
    if (additionalImages.length > 0) {
      formData.append("images", JSON.stringify(additionalImages));
    }

    toast.info("⏳ Updating product...");

    // Optimistic update
    const optimisticData = {
      name: name.trim(),
      description: description?.trim() || "",
      price: Number(price),
      brand: brand?.trim() || "",
      quantity: Number(quantity) || 0,
      countInStock: Number(countInStock) || 0
    };

    await updateProductOptimistically(
      id,
      optimisticData,
      updateProduct({ productId: id, formData })
    );

    toast.dismiss();
    toast.success("✅ Product updated successfully");

    setTimeout(() => {
      navigate("/admin/allproductslist");
    }, 800);
  } catch (err) {
    console.error("❌ Update error:", err);
    toast.dismiss();
    toast.error(
      err?.data?.message ||
        err?.error ||
        err?.message ||
        "❌ Failed to update product. Please try again."
    );
  }
};


  const deleteHandler = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await deleteProductOptimistically(id, deleteProduct(id));
      toast.success("🗑️ Product deleted successfully");
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error("Delete Error:", err);

      const errorMessage =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "❌ Failed to delete product. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white">
      <div className="container xl:mx-[9rem] sm:mx-[0] py-8">
      <div className="flex flex-col md:flex-row">
        <form onSubmit={submitHandler} className="md:w-3/4 p-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Product Editor
            </h2>
            <p className="text-gray-400">Update product details and manage images</p>
          </div>

          {imagePreview && (
            <div className="text-center mb-4 relative">
              <img
                src={imagePreview}
                alt="Product Preview"
                className="block mx-auto max-h-[200px] rounded-lg shadow-md"
              />
              <IconButton
                aria-label="remove image"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImageHandler();
                }}
                className="!absolute !top-0 !right-0 !text-white !bg-red-600 hover:!bg-red-700 !p-1"
                sx={{ transform: "translate(50%, -50%)" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          )}

          <label
            className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-2 border-dashed border-gray-700 hover:border-pink-500 px-4 block w-full text-center rounded-xl cursor-pointer font-bold py-11 transition-all duration-300 mb-6 hover:bg-gradient-to-br hover:from-pink-600/10 hover:to-purple-600/10"
          >
            {image ? "Change Image" : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={uploadFileHandler}
              className="hidden"
            />
          </label>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-[48%]">
              <label className="block mb-1">Name</label>
              <input
                type="text"
                className="w-full p-4 rounded-lg bg-[#101011] border border-gray-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="block mb-1">Price</label>
              <input
                type="number"
                className="w-full p-4 rounded-lg bg-[#101011] border border-gray-700"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-[48%]">
              <label className="block mb-1">Quantity</label>
              <input
                type="number"
                className="w-full p-4 rounded-lg bg-[#101011] border border-gray-700"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="block mb-1">Brand</label>
              <input
                type="text"
                className="w-full p-4 rounded-lg bg-[#101011] border border-gray-700"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-[48%]">
              <label className="block mb-1">Category</label>
              <select
                className="w-full p-4 rounded-lg bg-[#101011] border border-gray-700"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-[48%]">
              <label className="block mb-1">Stock</label>
              <input
                type="number"
                className="w-full p-4 rounded-lg bg-[#101011] border border-gray-700"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-1">Description</label>
            <textarea
              rows="4"
              className="w-full p-4 rounded-lg bg-[#101011] border border-gray-700 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Multiple Images Upload */}
          <div className="mb-6">
            <MultiImageUpload
              onImagesUploaded={(newImages) => {
                setAdditionalImages(prev => [...prev, ...newImages]);
                toast.success(`${newImages.length} additional images uploaded!`);
              }}
              onImageDeleted={(imageUrl, index) => {
                setAdditionalImages(prev => {
                  const updated = prev.filter((_, i) => i !== index);
                  console.log('Removing image at index:', index, 'Updated array:', updated);
                  return updated;
                });
              }}
              existingImages={additionalImages}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={deleteHandler}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
            >
              Delete Product
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ProductUpdate;
