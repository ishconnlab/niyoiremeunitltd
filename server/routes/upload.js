import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createHash, randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();
const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const valid = new Set(['.jpg', '.jpeg', '.png', '.webp']);
    if (valid.has(ext) && ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(null, true);
    cb(new Error('Upload a JPEG, PNG, or WebP image (maximum 5 MB).'));
  },
});

const isRealImage = (buffer, mime) => {
  if (mime === 'image/jpeg') return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mime === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mime === 'image/webp') return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  return false;
};

const cloudinaryUpload = async (file) => {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `niyoireme/${randomUUID()}`;
  const params = { public_id: publicId, timestamp };
  const signingText = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join('&');
  const signature = createHash('sha1').update(`${signingText}${apiSecret}`).digest('hex');
  const form = new FormData();
  form.set('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.set('api_key', apiKey);
  form.set('timestamp', String(timestamp));
  form.set('public_id', publicId);
  form.set('signature', signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: form });
  const result = await response.json();
  if (!response.ok || !result.secure_url) throw new Error('Image storage provider rejected the upload.');
  return result.secure_url;
};

// @desc    Upload image
// @route   POST /api/upload
// @access  Private (super_admin)
router.post('/', protect, authorize('super_admin'), upload.single('image'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image.' });
  }
  try {
    if (!isRealImage(req.file.buffer, req.file.mimetype)) return res.status(400).json({ success: false, message: 'The uploaded file is not a valid image.' });
    const configuredCloud = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
    if (configuredCloud) {
      const imageUrl = await cloudinaryUpload(req.file);
      return res.status(201).json({ success: true, imageUrl, message: 'Image uploaded successfully.' });
    }
    if (process.env.NODE_ENV === 'production') return res.status(503).json({ success: false, message: 'Persistent image storage is not configured.' });
    const ext = req.file.mimetype === 'image/jpeg' ? '.jpg' : req.file.mimetype === 'image/png' ? '.png' : '.webp';
    const filename = `image-${Date.now()}-${randomUUID()}${ext}`;
    await fs.promises.writeFile(path.join(uploadDir, filename), req.file.buffer, { flag: 'wx' });
    return res.status(201).json({ success: true, imageUrl: `/uploads/${filename}`, message: 'Image uploaded successfully.' });
  } catch (error) {
    return next(error);
  }
});

export default router;

