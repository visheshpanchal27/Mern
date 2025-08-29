import asyncHandler from "../middlewares/asyncHandler.js";
import Product from '../models/productModal.js';
import cloudinary from '../config/cloudinary.js'; 
import fs from 'fs';
import path from "path";
import formidable from "formidable";

const addProduct = asyncHandler(async (req, res) => {
  try {
    console.log("📥 Incoming fields:", req.fields);
    console.log("📥 Incoming files:", req.files);

    const {
      name,
      description,
      price,
      category,
      countInStock,
      quantity,
      brand,
    } = req.fields;

    // ✅ Required checks
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!brand) return res.status(400).json({ message: "Brand is required" });
    if (!description)
      return res.status(400).json({ message: "Description is required" });
    if (!price) return res.status(400).json({ message: "Price is required" });
    if (!category)
      return res.status(400).json({ message: "Category is required" });
    if (!countInStock)
      return res.status(400).json({ message: "countInStock is required" });

    let imageUrl = "";
    let additionalImages = [];

    // ✅ If main image provided, upload to Cloudinary
    if (req.files && req.files.image) {
      try {
        const file = req.files.image;
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "mern-products",
        });

        imageUrl = result.secure_url;
        fs.unlinkSync(file.path); // cleanup temp file
      } catch (err) {
        console.error("❌ Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    // ✅ Handle additional images from frontend (already uploaded URLs)
    if (req.fields && req.fields.images) {
      try {
        const imagesData = JSON.parse(req.fields.images);
        if (Array.isArray(imagesData)) {
          additionalImages = imagesData;
        }
      } catch (err) {
        console.error("❌ Failed to parse images data:", err);
      }
    }

    // ✅ Create product
    const product = new Product({
      name,
      description,
      price,
      category,
      countInStock,
      quantity,
      brand,
      image: imageUrl,
      images: additionalImages,
    });

    const saved = await product.save();
    res.status(201).json({
      message: "✅ Product created successfully",
      product: saved,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
});

export const updateProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const fields = req.fields || {};
    const files = req.files || {};

    // ✅ Update fields if provided
    if (fields.name) product.name = fields.name;
    if (fields.description) product.description = fields.description;
    if (fields.category) product.category = fields.category;
    if (fields.brand) product.brand = fields.brand;
    if (fields.price) product.price = Number(fields.price);
    if (fields.quantity) product.quantity = Number(fields.quantity);
    if (fields.countInStock) product.countInStock = Number(fields.countInStock);

    // ✅ Handle main image update
    if (files.image) {
      // (Optional) Delete old image from Cloudinary if stored there
      if (product.image && product.image.includes("res.cloudinary.com")) {
        const publicId = product.image.split("/").pop().split(".")[0]; // crude extract
        try {
          await cloudinary.uploader.destroy(`mern_products/${publicId}`);
        } catch (err) {
          console.warn("⚠️ Failed to delete old Cloudinary image:", err.message);
        }
      }

      const uploadResult = await cloudinary.uploader.upload(files.image.path, {
        folder: "mern_products",
      });
      product.image = uploadResult.secure_url;
    }

    // ✅ Handle additional images update from frontend
    if (fields.images) {
      try {
        const imagesData = JSON.parse(fields.images);
        if (Array.isArray(imagesData)) {
          product.images = imagesData;
        }
      } catch (err) {
        console.error("❌ Failed to parse images data:", err);
      }
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct); // ✅ frontend gets full updated product
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "❌ Failed to update product" });
  }
};

// DELETE PRODUCT
const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete images from Cloudinary if they exist
    if (product.image && product.image.includes("res.cloudinary.com")) {
      try {
        const publicId = product.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`mern_products/${publicId}`);
      } catch (err) {
        console.warn("⚠️ Failed to delete main image from Cloudinary:", err.message);
      }
    }

    // Delete additional images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl.includes("res.cloudinary.com")) {
          try {
            const publicId = imageUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`mern_products/${publicId}`);
          } catch (err) {
            console.warn("⚠️ Failed to delete additional image from Cloudinary:", err.message);
          }
        }
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// FETCH PRODUCTS (with search + limit)
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// FETCH PRODUCT BY ID
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

// FETCH ALL PRODUCTS (Simplified)
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    console.log('📦 Fetching all products...');
    
    const products = await Product.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();
    
    const total = products.length;
    
    console.log(`✅ Found ${total} products`);
    
    res.json({
      products,
      total,
      success: true
    });
  } catch (error) {
    console.error('❌ Error fetching all products:', error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ADD PRODUCT REVIEW
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// FETCH TOP PRODUCTS
const fetchTopProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// FETCH NEW PRODUCTS
const fetchNewProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// FILTER PRODUCTS
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// FETCH RANDOM PRODUCTS
const fetchRandomProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching random products:', error);
    res.status(500).json({ message: 'Failed to fetch random products' });
  }
});

// SEARCH PRODUCTS
const searchProducts = asyncHandler(async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex }
      ]
    })
    .populate('category', 'name')
    .limit(20)
    .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

export {
  addProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProduct,
  fetchNewProduct,
  filterProducts,
  fetchRandomProducts,
  searchProducts,
};
