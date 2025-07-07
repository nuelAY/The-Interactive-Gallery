import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (id: number) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return next(new Error("Unauthorized! User already exists"));
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashed);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new Error("Unauthorized! Invalid Credentials"));
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: For authenticated routes
export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json(user);
};
