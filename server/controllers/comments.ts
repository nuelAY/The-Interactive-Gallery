import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import db from "../db";
import pool from "../db";

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { imageId } = req.params;
  const result = await db.query(
    "SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC",
    [imageId]
  );
  res.json(result.rows);
});

export const postComment = asyncHandler (async (req: Request, res: Response) => {
  const { text } = req.body;
  const { imageId } = req.params;
  const userId = (req as any).user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized!" });
    return;
  }
  try {
    const result = await pool.query(
      `INSERT INTO comments (image_id, user_id, text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [imageId, userId, text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});




function async(
  arg0: (
    req: Request,
    res: Response
  ) => Promise<Response<any, Record<string, any>> | undefined>
) {
  throw new Error("Function not implemented.");
}
function next(arg0: Error): Response<any, Record<string, any>> | PromiseLike<Response<any, Record<string, any>> | undefined> | undefined {
  throw new Error("Function not implemented.");
}

