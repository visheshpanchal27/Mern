import express from 'express';
import { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile ,updateCurrentUserProfile,deleteUserById,getUserById, updateUserById, googleAuth } from '../controllers/userController.js';
import { authentication , authorizeAdmin } from '../middlewares/authentication.js';

const router = express.Router();

router.route('/').post(createUser).get(authentication, authorizeAdmin, getAllUsers);

router.post("/google-auth", googleAuth);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router.route('/profile').get(authentication, getCurrentUserProfile).put(authentication, updateCurrentUserProfile);


//admin routes
router.route('/:id').delete(authentication, authorizeAdmin, deleteUserById)
    .get(authentication, authorizeAdmin, getUserById)
    .put(authentication, authorizeAdmin, updateUserById);


export default router;
