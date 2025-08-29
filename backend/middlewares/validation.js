import { body, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = DOMPurify.sanitize(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  
  next();
};

// Validation rules
export const validateProduct = [
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('description').trim().isLength({ min: 1, max: 1000 }).escape(),
  body('price').isFloat({ min: 0 }),
  body('countInStock').isInt({ min: 0 }),
];

export const validateUser = [
  body('username').trim().isLength({ min: 3, max: 30 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];

export const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 1, max: 500 }).escape(),
];

// Check validation results
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};