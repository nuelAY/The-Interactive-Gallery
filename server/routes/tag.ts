// This entire code here is not of use, I wrote it thinking I would use it, but I eneded up not using it
import express from 'express';
import { getTagsByImage } from '../controllers/tagController';

const router = express.Router();

router.get('/:imageId', getTagsByImage);

export default router;
