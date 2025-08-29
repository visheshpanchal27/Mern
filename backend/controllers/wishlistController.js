import asyncHandler from '../middlewares/asyncHandler.js';
import Wishlist from '../models/wishlistModel.js';

// Get user wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate('products', 'name price image brand rating numReviews');
  
  if (!wishlist) {
    return res.json({ products: [] });
  }
  
  res.json(wishlist);
});

// Add product to wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
  }
  
  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    await wishlist.save();
  }
  
  res.json({ message: 'Product added to wishlist' });
});

// Remove product from wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  
  if (wishlist) {
    wishlist.products = wishlist.products.filter(
      id => id.toString() !== productId
    );
    await wishlist.save();
  }
  
  res.json({ message: 'Product removed from wishlist' });
});

// Clear wishlist
export const clearWishlist = asyncHandler(async (req, res) => {
  await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { upsert: true }
  );
  
  res.json({ message: 'Wishlist cleared' });
});