import asyncHandler from 'express-async-handler';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/userModels.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';
import jwt from 'jsonwebtoken';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation.js';

// Enhanced Register User
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all inputs");
  }

  // Sanitize inputs
  const sanitizedUsername = sanitizeInput(username);
  const sanitizedEmail = sanitizeInput(email);

  // Validate email format
  if (!validateEmail(sanitizedEmail)) {
    res.status(400);
    throw new Error("Please enter a valid email");
  }

  // Validate password strength
  if (!validatePassword(password)) {
    res.status(400);
    throw new Error("Password must be at least 8 characters with uppercase, lowercase, and number");
  }

  // Check existing user
  const existingUser = await User.findOne({ email: sanitizedEmail });
  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists");
  }

  // Create user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({ 
    username: sanitizedUsername, 
    email: sanitizedEmail, 
    password: hashedPassword 
  });

  // Set cookie AND return token in response
  const token = createToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token 
  });
});

// Enhanced Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const sanitizedEmail = sanitizeInput(email);

  if (!validateEmail(sanitizedEmail)) {
    res.status(400);
    throw new Error("Please enter a valid email");
  }

  // Find user
  const user = await User.findOne({ email: sanitizedEmail });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Set cookie AND return token
  const token = createToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    token // For header-based auth
  });
});

// Logout User (unchanged)
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// Get Current User Profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
  res.status(404);
  throw new Error("User not found");
});

// Update Current User Profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const user = await User.findById(req.user._id);

  if (user) {
    // Sanitize inputs
    const sanitizedUsername = req.body.username ? sanitizeInput(req.body.username) : user.username;
    const sanitizedEmail = req.body.email ? sanitizeInput(req.body.email) : user.email;

    // Validate email if provided
    if (req.body.email && !validateEmail(sanitizedEmail)) {
      res.status(400);
      throw new Error("Please enter a valid email");
    }

    // Validate password if provided
    if (req.body.password && !validatePassword(req.body.password)) {
      res.status(400);
      throw new Error("Password must be at least 8 characters with uppercase, lowercase, and number");
    }

    user.username = sanitizedUsername;
    user.email = sanitizedEmail;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Delete User
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Get User by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    return res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update User by ID (Admin)
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const googleAuth = asyncHandler(async (req, res) => {
  const { name, email, picture } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error('Name and email are required');
  }

  // Sanitize inputs
  const sanitizedName = sanitizeInput(name);
  const sanitizedEmail = sanitizeInput(email);

  // Validate email
  if (!validateEmail(sanitizedEmail)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  let user = await User.findOne({ email: sanitizedEmail });

  if (!user) {
    // Create new user for Google Auth
    user = await User.create({
      username: sanitizedName,
      email: sanitizedEmail,
      password: '', // No password for Google users
      image: picture || '',
    });
  }

  // Generate token and set it in cookie
  const token = createToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    image: user.image || picture,
    token, // Send token for localStorage
  });
});



export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  googleAuth,
};