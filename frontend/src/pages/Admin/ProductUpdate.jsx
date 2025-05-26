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

// ✅ Material UI
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [uploading, setUploading] = useState(false);

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (!productData) return;

    setName(productData.name || "");
    setDescription(productData.description || "");
    setPrice(productData.price || "");
    setCategory(productData.category?._id || "");
    setQuantity(productData.quantity || "");
    setBrand(productData.brand || "");
    setStock(productData.countInStock || "");

    if (productData.image) {
      setImagePreview(
        productData.image.startsWith("http")
          ? productData.image
          : `${import.meta.env.VITE_API_URL}${productData.image}`
      );
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

    if (!name || !description || !price || !category || !quantity || !brand || !stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = productData?.image || "";

      if (image instanceof File) {
        const uploadForm = new FormData();
        uploadForm.append("image", image);
        const res = await uploadProductImage(uploadForm).unwrap();
        imageUrl = res.image;
      }

      const productData = {
        name,
        description,
        price,
        category,
        quantity,
        brand,
        countInStock: stock,
        image: imageUrl,
      };

      await updateProduct({ productId: id, formData: productData }).unwrap();

      toast.success("Product updated successfully!");
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product");
    } finally {
      setUploading(false);
    }
  };

  const deleteHandler = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0] text-white">
      <div className="flex flex-col md:flex-row">
        <form onSubmit={submitHandler} className="md:w-3/4 p-4">
          <h2 className="text-xl font-semibold mb-6">Update / Delete Product</h2>

          {/* Image Preview */}
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
            className={`border px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 border-gray-700 hover:border-pink-500 transition mb-6 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {image ? "Change Image" : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={uploadFileHandler}
              className="hidden"
              disabled={uploading}
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
                value={stock}
                onChange={(e) => setStock(e.target.value)}
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

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold"
              disabled={uploading}
            >
              {uploading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={deleteHandler}
              className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg font-semibold"
              disabled={uploading}
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
