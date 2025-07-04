import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import commentRoutes from './routes/comments';
import imageRoutes from './routes/images';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/comments', commentRoutes);
app.use('/api/images', imageRoutes);

export default app;
