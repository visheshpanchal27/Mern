import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import { useOptimisticMutation } from "../../hooks/useOptimisticMutation";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaTags } from "react-icons/fa";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { updateCategoryOptimistically } = useOptimisticMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategoryOptimistically(
        selectedCategory._id,
        { name: updatingName },
        updateCategory({
          categoryId: selectedCategory._id,
          updatedCategory: { name: updatingName },
        })
      );

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Category updated successfully`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    console.log("Deleting category:", selectedCategory);
  
    if (!selectedCategory || !selectedCategory._id) {
      toast.error("No category selected for deletion");
      return;
    }
  
    try {
      const result = await deleteCategory({ categoryId: selectedCategory._id }).unwrap();
  
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${selectedCategory.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
      <div className="ml-[10rem] flex flex-col md:flex-row py-8">
      <div className="md:w-3/4 p-3">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Category Management
          </h1>
          <p className="text-gray-400">Create and manage product categories</p>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] p-6 rounded-2xl border border-gray-800/50 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaPlus className="text-pink-500" />
            <h3 className="text-lg font-semibold text-white">Add New Category</h3>
          </div>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] p-6 rounded-2xl border border-gray-800/50"
        >
          <div className="flex items-center gap-2 mb-6">
            <FaTags className="text-pink-500" />
            <h3 className="text-lg font-semibold text-white">Existing Categories ({categories?.length || 0})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {categories?.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/30 rounded-xl p-4 group cursor-pointer"
                  onClick={() => {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-pink-400 font-medium group-hover:text-white transition-colors">
                      {category.name}
                    </span>
                    <FaEdit className="text-gray-500 group-hover:text-pink-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <Modal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          value={updatingName}
          setValue={setUpdatingName}
          handleUpdate={handleUpdateCategory}
          handleDelete={handleDeleteCategory}
        />
      </div>
    </div>
    </div>
  );
};

export default CategoryList;
