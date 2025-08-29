import express from 'express';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { authentication, authorizeAdmin } from '../middlewares/authentication.js';
import { validateCSRFToken } from '../middlewares/csrfProtection.js';

const router = express.Router();
const storage = multer.memoryStorage();

// File validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Single image upload
router.post('/', authentication, authorizeAdmin, validateCSRFToken, upload.single('image'), async (req, res) => {
  try {
    const fileStr = req.file.buffer.toString('base64');
    const uploadedResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileStr}`, {
      folder: 'vishesh-store',
    });

    res.json({ image: uploadedResponse.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error: ' + error.message);
  }
});

// Multiple images upload
router.post('/multiple', authentication, authorizeAdmin, validateCSRFToken, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(file => {
      const fileStr = file.buffer.toString('base64');
      return cloudinary.uploader.upload(`data:image/jpeg;base64,${fileStr}`, {
        folder: 'vishesh-store',
      });
    });

    const uploadedResponses = await Promise.all(uploadPromises);
    const imageUrls = uploadedResponses.map(response => response.secure_url);

    res.json({ images: imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error: ' + error.message);
  }
});

// Delete image from Cloudinary
router.delete('/image', authentication, authorizeAdmin, validateCSRFToken, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) {
      return res.status(400).json({ message: 'Invalid image URL' });
    }

    // Extract public ID from Cloudinary URL
    const publicId = imageUrl.split('/').pop().split('.')[0];
    
    await cloudinary.uploader.destroy(`vishesh-store/${publicId}`);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error: ' + error.message);
  }
});

export default router;
