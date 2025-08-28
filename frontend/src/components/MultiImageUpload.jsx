import { useState } from "react";
import { toast } from "react-toastify";

const MultiImageUpload = ({ onImagesUploaded, existingImages = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

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
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/uploads/multiple', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImagesUploaded(data.images);
      setSelectedFiles([]);
      toast.success(`${data.images.length} images uploaded successfully!`);
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
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </div>
      )}

      {existingImages.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">Existing Images:</p>
          <div className="grid grid-cols-4 gap-2">
            {existingImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Existing ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;