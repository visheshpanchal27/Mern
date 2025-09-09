import asyncHandler from "../middlewares/asyncHandler.js";
import Product from '../models/productModal.js';
import cloudinary from '../config/cloudinary.js'; 
import fs from 'fs';
import path from "path";
import formidable from "formidable";
import DOMPurify from 'isomorphic-dompurify';

// Sanitize input for logging
const sanitizeForLog = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input).replace(/[\r\n]/g, ' ');
};

const addProduct = asyncHandler(async (req, res) => {
  try {
    console.log("📥 Incoming fields:", Object.keys(req.fields || {}));
    console.log("📥 Incoming files:", Object.keys(req.files || {}));

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
    console.log('🔄 Update request received for product:', sanitizeForLog(req.params.id));
    console.log('📝 Fields:', Object.keys(req.fields || {}));
    console.log('📁 Files:', Object.keys(req.files || {}));
    
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      console.log('❌ Product not found:', id);
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
    if (files && files.image && files.image.path) {
      try {
        // (Optional) Delete old image from Cloudinary if stored there
        if (product.image && product.image.includes("res.cloudinary.com")) {
          const publicId = product.image.split("/").pop().split(".")[0];
          try {
            await cloudinary.uploader.destroy(`vishesh-store/${publicId}`);
          } catch (err) {
            console.warn("⚠️ Failed to delete old Cloudinary image:", err.message);
          }
        }

        const uploadResult = await cloudinary.uploader.upload(files.image.path, {
          folder: "vishesh-store",
        });
        product.image = uploadResult.secure_url;
        console.log('✅ New image uploaded:', uploadResult.secure_url);
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError);
        throw new Error('Failed to upload image: ' + uploadError.message);
      }
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
    console.log('✅ Product updated successfully:', updatedProduct._id);

    res.json(updatedProduct); // ✅ frontend gets full updated product
  } catch (error) {
    console.error("❌ Update error:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Send more specific error message
    const errorMessage = error.message || "Failed to update product";
    res.status(400).json({ 
      message: errorMessage,
      error: error.name,
      details: error.errors || null
    });
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

// FETCH PRODUCTS (with search + limit + category filter)
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = req.query.limit ? parseInt(req.query.limit) : 50;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * pageSize;
    
    let query = {};
    
    // Search by keyword
    if (req.query.search || req.query.keyword) {
      const searchTerm = req.query.search || req.query.keyword;
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      products,
      total: count,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: page < Math.ceil(count / pageSize),
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
    const products = await Product.find({}).sort({ rating: -1 }).limit(20); // Increased from 4 to 20
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// FETCH NEW PRODUCTS
const fetchNewProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(20); // Increased from 5 to 20
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

// FETCH RANDOM PRODUCTS (using MongoDB $sample)
const fetchRandomProducts = asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const maxLimit = Math.min(limit, 50); // Cap at 50 products
    
    const randomProducts = await Product.aggregate([
      { $sample: { size: maxLimit } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          originalPrice: 1,
          image: 1,
          images: 1,
          brand: 1,
          countInStock: 1,
          rating: 1,
          numReviews: 1,
          category: { $arrayElemAt: ['$category.name', 0] },
          createdAt: 1
        }
      }
    ]);
    
    res.json({
      products: randomProducts,
      count: randomProducts.length,
      limit: maxLimit,
      timestamp: new Date().toISOString()
    });
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
    .limit(50) // Increased search limit
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
