import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust path as needed
import { Draft } from 'immer'; // Import Draft from Immer

export interface GalleryItem {
    date: string;
    galleryName?: string;
    images?: string[];
    category: string;
    __v: number;
    _id: string;
}

interface GalleryState {
    items: GalleryItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: GalleryState = {
    items: [],
    status: 'idle',
    error: null,
};

export const getGalleryItems = createAsyncThunk<GalleryItem[], void, { state: RootState }>(
    'blogs/fetchGalleryItems',
    async (_, thunkAPI) => {
        try {
            const response = await fetch('http://localhost:3000/api/gallery');
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

const gallerySlice = createSlice({
    name: 'gallery',
    initialState,
    reducers: {
        addGalleryItem: (state: Draft<GalleryState>, action: PayloadAction<GalleryItem>) => {
            state.items = [...state.items, action.payload];
        },
        updateGalleryItem: (state: Draft<GalleryState>, action: PayloadAction<GalleryItem>) => {
            const { _id } = action.payload;
            const existingItem = state.items.find(item => item._id === _id);
            if (existingItem) {
                Object.assign(existingItem, action.payload);
            }
        },
        removeGalleryItem: (state: Draft<GalleryState>, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
        setGalleryItems: (state: Draft<GalleryState>, action: PayloadAction<GalleryItem[]>) => {
            state.items = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getGalleryItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getGalleryItems.fulfilled, (state, action: PayloadAction<GalleryItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(getGalleryItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unknown error';
            });
    },
});

export const { addGalleryItem, updateGalleryItem, removeGalleryItem, setGalleryItems } = gallerySlice.actions;
export default gallerySlice.reducer;