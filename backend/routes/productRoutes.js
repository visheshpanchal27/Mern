import express from 'express';
import formidable from 'express-formidable';

const router = express.Router()

import { 
    addProduct,
    removeProduct,
    updateProductDetails,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProduct,
    fetchNewProduct,
    filterProducts,
    fetchRandomProducts,
    searchProducts,
} from '../controllers/productController.js';
import { authentication,authorizeAdmin } from '../middlewares/authentication.js';
import checkId from '../middlewares/checkId.js';
import { validateProduct, validateReview, checkValidation, sanitizeInput } from '../middlewares/validation.js';

router.route('/')
    .get(fetchProducts)
    .post(authentication, authorizeAdmin, sanitizeInput, formidable(), validateProduct, checkValidation, addProduct);

router.route('/allProducts').get(fetchAllProducts);
router.route('/:id/reviews').post(authentication, checkId, sanitizeInput, validateReview, checkValidation, addProductReview);

router.get('/top', fetchTopProduct)
router.get('/new', fetchNewProduct)
router.get('/search', searchProducts)
router.get('/random', fetchRandomProducts);


router
    .route('/:id')
    .put(authentication, authorizeAdmin, checkId, sanitizeInput, formidable(), validateProduct, checkValidation, updateProductDetails)
    .get(checkId , fetchProductById)
    .delete(authentication, authorizeAdmin, checkId , removeProduct);

router.route("/filtered-products").post(filterProducts);


export default router;
