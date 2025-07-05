import express from 'express';
import axios from 'axios';

const router = express.Router();
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

console.log("UNSPLASH_ACCESS_KEY:", UNSPLASH_ACCESS_KEY);


router.get('/', async (req, res) => {
  const query = req.query.query || 'gallery';
  const page = req.query.page || 1;

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        page,
        per_page: 12,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Unsplash API error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

export default router;
