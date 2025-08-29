import express from 'express';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist 
} from '../controllers/wishlistController.js';
import { authentication } from '../middlewares/authentication.js';

const router = express.Router();

router.route('/')
  .get(authentication, getWishlist)
  .post(authentication, addToWishlist)
  .delete(authentication, clearWishlist);

router.delete('/:productId', authentication, removeFromWishlist);

export default router;