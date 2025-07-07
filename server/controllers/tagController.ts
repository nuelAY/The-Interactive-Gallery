// This entire code here is not of use, I wrote it thinking I would use it, but I eneded up not using it

import { Request, Response } from 'express';
import pool from '../db';

export const getTagsByImage = async (req: Request, res: Response) => {
  const { imageId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT t.id, t.name
      FROM tags t
      JOIN image_tags it ON t.id = it.tag_id
      WHERE it.image_id = $1
      `,
      [imageId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};
