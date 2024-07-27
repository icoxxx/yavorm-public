import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './homeItems/dataSlice'

export const store = configureStore({
    reducer: {
      data: dataReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

