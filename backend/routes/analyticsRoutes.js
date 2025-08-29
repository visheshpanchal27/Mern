import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { authentication, authorizeAdmin } from '../middlewares/authentication.js';

const router = express.Router();

router.get('/', authentication, authorizeAdmin, getAnalytics);

export default router;