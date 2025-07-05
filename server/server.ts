import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import imageRoutes from './routes/images';
import authRoutes from './routes/auth';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/images', imageRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
