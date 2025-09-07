import express from 'express';
import { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile ,updateCurrentUserProfile,deleteUserById,getUserById, updateUserById, googleAuth, verifyEmail, resendVerification } from '../controllers/userController.js';
import { authentication , authorizeAdmin } from '../middlewares/authentication.js';
import { validateUserRegistration, handleValidationErrors, sanitizeInput } from '../middlewares/inputValidation.js';
import { validateCSRFToken } from '../middlewares/csrfProtection.js';

const router = express.Router();

router.route('/').post(sanitizeInput, validateUserRegistration, handleValidationErrors, createUser).get(authentication, authorizeAdmin, getAllUsers);

router.post("/google-auth", googleAuth);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

router.post("/auth", sanitizeInput, loginUser);
router.post("/logout", logoutCurrentUser);

router.route('/profile').get(authentication, getCurrentUserProfile).put(authentication, validateCSRFToken, sanitizeInput, updateCurrentUserProfile);


//admin routes
router.route('/:id').delete(authentication, authorizeAdmin, deleteUserById)
    .get(authentication, authorizeAdmin, getUserById)
    .put(authentication, authorizeAdmin, updateUserById);


export default router;
