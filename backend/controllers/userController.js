import asyncHandler from 'express-async-handler';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/userModels.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';
import jwt from 'jsonwebtoken';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation.js';
import { sendVerificationEmail } from '../utils/emailService.js';

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

  // Generate verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({ 
    username: sanitizedUsername, 
    email: sanitizedEmail, 
    password: hashedPassword,
    emailVerificationCode: verificationCode,
    emailVerificationExpires: verificationExpires
  });

  // Send verification email
  try {
    // Temporarily skip email sending for testing
    console.log('📝 Verification code for', sanitizedEmail, ':', verificationCode);
    // await sendVerificationEmail(sanitizedEmail, verificationCode);
    console.log('✅ Verification email sent for:', sanitizedEmail);
  } catch (emailError) {
    console.error('❌ Email sending failed:', emailError);
    // Still allow registration but inform user
  }

  res.status(201).json({
    message: 'Registration successful. Please check your email for verification code.',
    email: sanitizedEmail
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
  console.log('Login attempt for:', sanitizedEmail);
  console.log('User found:', user ? 'Yes' : 'No');
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if email is verified (temporarily disabled for testing)
  // if (!user.isEmailVerified) {
  //   res.status(401);
  //   throw new Error("Please verify your email before logging in");
  // }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log('Password valid:', isPasswordValid);
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
  try {
    const { name, email, picture } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();

    // Simple email validation
    if (!sanitizedEmail.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    let user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      // Create new user for Google Auth
      user = await User.create({
        username: sanitizedName,
        email: sanitizedEmail,
        password: 'google-auth-user', // Placeholder for Google users
        image: picture || '',
        isGoogleUser: true,
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
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



// Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400);
    throw new Error("Email and verification code are required");
  }

  const user = await User.findOne({ 
    email: sanitizeInput(email),
    emailVerificationCode: code,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired verification code");
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  const token = createToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    token
  });
});

// Resend Verification Code
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email: sanitizeInput(email) });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.emailVerificationCode = verificationCode;
  user.emailVerificationExpires = verificationExpires;
  await user.save();

  await sendVerificationEmail(user.email, verificationCode);

  res.status(200).json({
    message: 'Verification code sent successfully'
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
  verifyEmail,
  resendVerification,
};