import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import asyncHandler from './asyncHandler.js';

const authentication = asyncHandler(async (req, res, next) => {
  let token;
  let clientType = 'web';
  
  // 1. Check Authorization header first
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    // Determine client type from User-Agent or custom header
    clientType = req.headers['x-client-type'] === 'mobile' ? 'mobile' : 'web';
  }
  
  // No cookie fallback - use only header tokens

  if (!token) {
    return res.status(401).json({ 
      message: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  try {
    const secret = clientType === 'web' ? process.env.JWT_WEB_SECRET : process.env.JWT_MOBILE_SECRET;
    const decoded = jwt.verify(token, secret);
    
    // Verify client type matches token
    if (decoded.clientType !== clientType) {
      return res.status(401).json({ 
        message: 'Invalid token for client type',
        code: 'INVALID_CLIENT_TOKEN'
      });
    }
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ 
        message: 'User no longer exists',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Check if user is active
    if (user.isBlocked) {
      return res.status(403).json({ 
        message: 'Account has been blocked',
        code: 'ACCOUNT_BLOCKED'
      });
    }
    
    req.user = user;
    req.clientType = clientType;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({ 
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
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