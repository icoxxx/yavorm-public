import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './rentalItems/dataSlice'
import blogsReducer from './blogItems/blogSlice';
import galleryReducer from './galleryItems/gallerySlice';

export const store = configureStore({
    reducer: {
      data: dataReducer,
      blogs: blogsReducer,
      gallery: galleryReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

