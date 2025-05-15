import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import asyncHandler from './asyncHandler.js';

const authentication = asyncHandler(async (req, res, next) => {
  // 1. Check Authorization header first
  let token = req.headers.authorization?.split(' ')[1];
  
  // 2. Fallback to cookie if no header token
  if (!token && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

export { authentication, authorizeAdmin };