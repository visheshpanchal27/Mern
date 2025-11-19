import { useState } from "react";
import { toast } from "react-toastify";
import { useUploadProductImageMutation } from "../redux/api/productApiSlice";

const MultiImageUpload = ({ onImagesUploaded, existingImages = [], isLoading = false, onImageDeleted }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [uploadProductImage] = useUploadProductImageMutation();

  if (isLoading) return <div className="text-gray-400">Loading...</div>;

  const deleteImage = async (imageUrl, index) => {
    setDeleting(index);
    try {
      // Call the parent callback immediately to update UI
      onImageDeleted && onImageDeleted(imageUrl, index);
      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    } finally {
      setDeleting(null);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setSelectedFiles(files);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select images first");
      return;
    }

    setUploading(true);
    try {
      const uploadedImages = [];
      
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('image', file);
        
        const result = await uploadProductImage(formData).unwrap();
        uploadedImages.push(result.image);
      }
      
      onImagesUploaded(uploadedImages);
      setSelectedFiles([]);
      toast.success(`${uploadedImages.length} images uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Additional Images (Max 5)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-2">
            Selected: {selectedFiles.length} file(s)
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                  loading="lazy"
                />
                <button
                  onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={uploadImages}
            disabled={uploading}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2"
          >
            {uploading && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            )}
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      )}

      {existingImages.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">Existing Images:</p>
          <div className="grid grid-cols-4 gap-2">
            {existingImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                  loading="lazy"
                />
                {onImageDeleted && (
                  <button
                    onClick={() => deleteImage(img, index)}
                    disabled={deleting === index}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    {deleting === index ? (
                      <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"></div>
                    ) : (
                      '×'
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;