// This is for storing and retrieving user commments made on each pictures

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Comment {
  length: number;
  id: number;
  imageId: string;
  text: string;
  createdAt: string;
    userId: number;
  author?: {
    name: string;
  };
}

interface CommentState {
  commentsByImage: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
  isPosting: boolean;
}

const initialState: CommentState = {
  commentsByImage: {},
  loading: false,
  error: null,
  isPosting: false,
};

// GET comments for an image
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (imageId: string, thunkAPI) => {
    try {
      console.log("🔄 Fetching comments for:", imageId);
      const res = await fetch(`http://localhost:5000/api/comments/${imageId}`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to fetch comments");
      }

      const data = await res.json();
      console.log("✅ Fetched comments:", data);
      return data;
    } catch (err: any) {
      console.error("❌ fetchComments error:", err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// POST a new comment
export const postComment = createAsyncThunk(
  "comments/postComment",
  async (
    {
      imageId,
      text,
      token,
    }: { imageId: string; text: string; token: string | null },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${imageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to post comment");
      }

      const data = await res.json();
      console.log("✅ Comment posted:", data);
      return data;
    } catch (err: any) {
      console.error("❌ postComment error:", err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        const imageId = action.meta.arg; // ⬅️ imageId was passed into the thunk
        state.commentsByImage[imageId] = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(postComment.pending, (state) => {
        state.isPosting = true;
        state.error = null;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.isPosting = false;

        const imageId = action.payload.imageId;
        if (!state.commentsByImage[imageId]) {
          state.commentsByImage[imageId] = [];
        }
        // Add new comment to top of list
        state.commentsByImage[imageId].unshift(action.payload);
      })

      .addCase(postComment.rejected, (state, action) => {
        state.isPosting = false;
        state.error = action.payload as string;
      });
  },
});

export default commentSlice.reducer;
