import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./index";
import { ReactNode } from "react";

type UnsplashImage = {
  id: string;
  alt_description: string;
  urls: { small: string; full: string };
  user: {
    [x: string]: ReactNode;
    tag: ReactNode;
    description: ReactNode; name: string 
};
};

interface GalleryState {
  images: UnsplashImage[];
  loading: boolean;
  error: string | null;
  activeTag: string | null; // ← NEW
}

const initialState: GalleryState = {
  images: [],
  loading: false,
  error: null,
  activeTag: null, // ✅
};

export const fetchImages = createAsyncThunk(
  "gallery/fetchImages",
  async (query: string = "gallery") => {
    const res = await fetch(`http://localhost:5000/api/images?query=${query}`);
    const data = await res.json();
    return data.results;
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setActiveTag: (state, action) => {
      state.activeTag = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchImages.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch images";
      });
  },
});

export const { setActiveTag } = gallerySlice.actions;
export default gallerySlice.reducer;
export const selectGallery = (state: RootState) => state.gallery;
