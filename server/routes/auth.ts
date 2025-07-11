import express from 'express';
import { register, login, getMe } from '../controllers/authController';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.get('/me', getMe); 

export default router;
