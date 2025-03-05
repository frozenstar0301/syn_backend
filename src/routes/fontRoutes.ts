import express from 'express';
import multer from 'multer';
import { getFonts, uploadFont } from '../controllers/fontController';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.get('/', getFonts);
router.post('/upload', upload.single('font'), uploadFont);

export default router;
