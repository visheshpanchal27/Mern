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

    await updateProduct({
      productId: id,
      formData, // ✅ correct key
    }).unwrap();

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
      await deleteProduct(id).unwrap();
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
    <div className="container xl:mx-[9rem] sm:mx-[0] text-white">
      <div className="flex flex-col md:flex-row">
        <form onSubmit={submitHandler} className="md:w-3/4 p-4">
          <h2 className="text-xl font-semibold mb-6">Update / Delete Product</h2>

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
            className="border px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 border-gray-700 hover:border-pink-500 transition mb-6"
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
                setAdditionalImages(prev => prev.filter((_, i) => i !== index));
              }}
              existingImages={additionalImages}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
            >
              Update
            </button>
            <button
              type="button"
              onClick={deleteHandler}
              className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg font-semibold"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdate;
