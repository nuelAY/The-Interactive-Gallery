import { configureStore } from '@reduxjs/toolkit';
import galleryReducer from './gallerySlice';
import authReducer from './authSlice';
import commentReducer from './commentsSlice';
import tagReducer from './tagSlice';

export const store = configureStore({
  reducer: {
    gallery: galleryReducer,
    auth: authReducer,
    comments: commentReducer,
    tags: tagReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
