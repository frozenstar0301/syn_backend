import express from 'express';
import multer from 'multer';
import { getImages, uploadImage } from '../controllers/imageController';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.get('/', getImages);
router.post('/upload', upload.single('image'), uploadImage);

export default router;
