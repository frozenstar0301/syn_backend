import express from 'express';
import { getScreen, saveScreen } from '../controllers/changesettingController';

const router = express.Router();

router.get('/', getScreen);
router.post('/', saveScreen);

export default router;