import { configureStore } from '@reduxjs/toolkit';
import galleryReducer from './gallerySlice';
import authReducer from './authSlice';
import commentReducer from './commentsSlice';

export const store = configureStore({
  reducer: {
    gallery: galleryReducer,
    auth: authReducer,
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
