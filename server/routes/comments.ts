import express from 'express';
import { getComments, postComment } from '../controllers/comments';
const router = express.Router();

router.get('/:imageId', getComments);
router.post('/:imageId', postComment);

export default router;
