import express from 'express';
import { getTagsByImage } from '../controllers/tagController';

const router = express.Router();

router.get('/:imageId', getTagsByImage);

export default router;
