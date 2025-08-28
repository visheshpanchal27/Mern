import express from 'express';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({ storage });

// Single image upload
router.post('/', upload.single('image'), async (req, res) => {
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
router.post('/multiple', upload.array('images', 5), async (req, res) => {
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

export default router;
