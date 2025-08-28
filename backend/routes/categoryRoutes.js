import express from "express";
const router = express.Router();

import { 
    createCategory,
    updateCategory,
    removeCategory,
    listCategory,
    readCategory
} from "../controllers/categoryControllers.js";

import { authentication, authorizeAdmin } from "../middlewares/authentication.js";

// ✅ Create category
router.route('/')
    .post(authentication, authorizeAdmin, createCategory) 
    .get(listCategory);  // ✅ changed: now GET /api/categories will work

// ✅ Update category
router.route('/:categoryId')
    .put(authentication, authorizeAdmin, updateCategory)
    .delete(authentication, authorizeAdmin, removeCategory)
    .get(readCategory);  // ✅ merged duplicate readCategory

export default router;
