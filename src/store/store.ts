import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './rentalItems/dataSlice'
import blogsReducer from './blogItems/blogSlice';

export const store = configureStore({
    reducer: {
      data: dataReducer,
      blogs: blogsReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

