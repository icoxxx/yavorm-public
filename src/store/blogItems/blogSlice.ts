import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust path as needed
import { Draft } from 'immer'; // Import Draft from Immer

export interface BlogItem {
    date: string;
    blogTitle?: string;
    blogText?: string;
    blogAuthor?: string;
    instaLink?: string;
    fbLink?: string;
    image?: string;
    category: string;
    __v: number;
    _id: string;
}

interface BlogState {
    items: BlogItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: BlogState = {
    items: [],
    status: 'idle',
    error: null,
};

export const getBlogItems = createAsyncThunk<BlogItem[], void, { state: RootState }>(
    'blogs/fetchBlogItems',
    async (_, thunkAPI) => {
        try {
            const response = await fetch('http://localhost:3000/api/blogs');
            if (!response.ok) {
                throw new Error('Failed to fetch blog items');
            }
            const data = await response.json();
            return data.items;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        addBlogItem: (state: Draft<BlogState>, action: PayloadAction<BlogItem>) => {
            state.items = [...state.items, action.payload];
        },
        updateBlogItem: (state: Draft<BlogState>, action: PayloadAction<BlogItem>) => {
            const { _id } = action.payload;
            const existingItem = state.items.find(item => item._id === _id);
            if (existingItem) {
                Object.assign(existingItem, action.payload);
            }
        },
        removeBlogItem: (state: Draft<BlogState>, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
        setBlogItems: (state: Draft<BlogState>, action: PayloadAction<BlogItem[]>) => {
            state.items = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getBlogItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getBlogItems.fulfilled, (state, action: PayloadAction<BlogItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(getBlogItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unknown error';
            });
    },
});

export const { addBlogItem, updateBlogItem, removeBlogItem, setBlogItems } = blogSlice.actions;
export default blogSlice.reducer;
