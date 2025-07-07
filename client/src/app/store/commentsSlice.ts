// client/store/commentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { JSX } from "react";

interface Comment {
  length: number;
  map(arg0: (comment: any) => JSX.Element): import("react").ReactNode;
  id: number;
  imageId: string;
  text: string;
  createdAt: string;
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  isPosting: boolean;
  token: string | null
}

const initialState: CommentState = {
  comments: [],
  token: null,
  loading: false,
  error: null,
  isPosting: false,
};

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (imageId: string) => {
    const res = await fetch(`http://localhost:5000/api/comments/${imageId}`);
    console.log("response:", res);
    return await res.json();
  }
);

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
    const res = await fetch(`http://localhost:5000/api/comments/${imageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ imageId, text }),
    });

    if (!res.ok) {
      const errorText = await res.text(); // this shows you the HTML error
      console.error("Server error:", errorText);
      throw new Error(`Server responded with status ${res.status}`);
    }

    return await res.json();
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
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch comments";
      });

    builder
      .addCase(postComment.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.isPosting = false;
        state.comments.push(action.payload);
         state.token = action.payload.token;
        // After successful login/signup
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(postComment.rejected, (state, action) => {
        state.isPosting = false;
        state.error = action.error.message || "Failed to post comment";
      });
  },
});

export default commentSlice.reducer;
