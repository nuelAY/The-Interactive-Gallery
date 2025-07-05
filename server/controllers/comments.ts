import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import db from '../db';

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { imageId } = req.params;
  const result = await db.query(
    'SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC',
    [imageId]
  );
  res.json(result.rows);
});

export const postComment = asyncHandler(async (req: Request, res: Response) => {
  const { imageId } = req.params;
  const { username, text } = req.body;
  

  if (!text || text.length < 3) {
    res.status(400).json({ error: 'Comment must be at least 3 characters long' });
    return;
  }

  const result = await db.query(
    'INSERT INTO comments (image_id, username, text) VALUES ($1, $2, $3) RETURNING *',
    [imageId, username, text]
  );

  res.status(201).json(result.rows[0]);
});
