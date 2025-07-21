import express from 'express';
import { addToCart, getCart, updateCart, clearCart } from '../controllers/cartController.js';
import { authentication } from '../middlewares/authentication.js';

const router = express.Router();

router.route('/')
  .get(authentication, getCart)        
  .post(authentication, addToCart)     
  .put(authentication, updateCart)     
  .delete(authentication, clearCart);  

export default router;
