import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (id: number) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

// Email regex for basic format checking
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


// To sign up user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Basic validations
  if (!name || !email || !password) {
    return next(new Error("Unauthorized! All Fields are required"));
  }

  if (!isValidEmail(email)) {
    return next(new Error("Unauthorized! invalid Email Format"));;
  }

  if (password.length < 6) {
    return next(new Error("Unauthorized! Password Must be 6 Characters Long"));
  }

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


// To Log in User
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Basic validations
  if (!email || !password) {
    return next(new Error("Email and Password are required!"));
  }

  if (!isValidEmail(email)) {
    return next(new Error("Unauthorized! Invalid Email Format"));
  }

  try {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new Error("Invalid Email or Password"));
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


// For authenticated routes
export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json(user);
};
