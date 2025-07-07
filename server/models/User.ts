import pool from '../db';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

// Create a new user
export const createUser = async (name: string, email: string, hashedPassword: string): Promise<User> => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, password, created_at`,
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

export const getUserById = async (id: number) => {
  const result = await pool.query(
    'SELECT id, name, email FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};
