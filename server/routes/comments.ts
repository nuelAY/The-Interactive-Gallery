import express from 'express';
import { getComments, postComment } from '../controllers/comments';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/:imageId', getComments);
router.post('/:imageId',protect, postComment);

export default router;
