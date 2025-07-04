import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const fetchImages = async (page = 1) => {
  const response = await axios.get('https://api.unsplash.com/photos', {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    params: { page, per_page: 12 },
  });
  return response.data;
};
