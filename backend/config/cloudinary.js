import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Create __dirname manually (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
