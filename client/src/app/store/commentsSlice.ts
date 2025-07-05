// client/store/commentSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Comment {
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
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
  isPosting: false,
};


export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (imageId: string) => {
    const res = await fetch(`http://localhost:5000/api/comments/${imageId}`);
    return await res.json();
  }
);

export const postComment = createAsyncThunk(
  'comments/postComment',
  async (
    {
      imageId,
      text,
      token,
    }: { imageId: string; text: string; token: string | null },
    thunkAPI
  ) => {
    const res = await fetch(`http://localhost:5000/api/comments/${imageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ text }),
    });
    return await res.json();
  }
);


const commentSlice = createSlice({
  name: 'comments',
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
        state.error = action.error.message || 'Failed to fetch comments';
      });

    builder
      .addCase(postComment.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.isPosting = false;
        state.comments.push(action.payload);
      })
      .addCase(postComment.rejected, (state, action) => {
        state.isPosting = false;
        state.error = action.error.message || 'Failed to post comment';
      });
  },
});


export default commentSlice.reducer;
