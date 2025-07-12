import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import db from "../db";
import pool from "../db";

// To fetch comments made by user
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { imageId } = req.params;
  const result = await db.query(
    "SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC",
    [imageId]
  );
  res.json(result.rows);
});

// To collect and store comments made by user
export const postComment = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  const { text } = req.body;
  const { imageId } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    return next(new Error("Unauthorized! User already exists"));
  }

  try {
    // First, insert the comment
    const insertResult = await pool.query(
      `INSERT INTO comments (image_id, user_id, text)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [imageId, userId, text]
    );

    const insertedId = insertResult.rows[0].id;

    // Then, fetch the full comment with author name
    const fetchResult = await pool.query(
      `SELECT 
         c.id, c.image_id, c.user_id, c.text, c.created_at,
         u.name AS author_name
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [insertedId]
    );

    const row = fetchResult.rows[0];

    // Return the inserted comment
    res.status(201).json({
      id: row.id,
      imageId: row.image_id,
      userId: row.user_id,
      text: row.text,
      createdAt: row.created_at,
      author: {
        name: row.author_name,
      },
    });
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// function async(
//   arg0: (
//     req: Request,
//     res: Response
//   ) => Promise<Response<any, Record<string, any>> | undefined>
// ) {
//   throw new Error("Function not implemented.");
// }
// function next(arg0: Error): Response<any, Record<string, any>> | PromiseLike<Response<any, Record<string, any>> | undefined> | undefined {
//   throw new Error("Function not implemented.");
// }
