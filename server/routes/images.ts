import express from 'express';
import { fetchImages } from '../services/unsplash';
const router = express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const images = await fetchImages(page);
  res.json(images);
});

export default router;
