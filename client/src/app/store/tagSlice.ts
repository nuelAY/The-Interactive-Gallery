// This entire code here is not of use, I wrote it thinking I would use it, but I eneded up not using it

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Tag {
  id: number;
  name: string;
}

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
};

export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async (imageId: string) => {
    const res = await fetch(`http://localhost:5000/api/tags/${imageId}`);
    return await res.json();
  }
);

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tags';
      });
  },
});

export default tagSlice.reducer;
