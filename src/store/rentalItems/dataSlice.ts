import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust path as needed
import { Draft } from 'immer'; // Import Draft from Immer

export interface RentalItem {
    date: string;
    description?: string;
    itemName?: string;
    modelName?: string;
    rentalCategory?: string;
    image?: string;
    category: string;
    __v: number;
    _id: string;
}

interface DataState {
    items: RentalItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: DataState = {
    items: [],
    status: 'idle',
    error: null,
};


export const getItems = createAsyncThunk<RentalItem[], void, { state: RootState }>(
    'data/fetchData',
    async (_, thunkAPI) => {
        try {
            const response = await fetch('http://localhost:3000/api/rental', );
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            return data.items; // Assuming `items` is an array of `Item` type
        } catch (error:any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        addItem: (state: Draft<DataState>, action: PayloadAction<RentalItem>) => {
            state.items = [...state.items, action.payload];
        },
        updateItem: (state: Draft<DataState>, action: PayloadAction<RentalItem>) => {
            const { _id } = action.payload;
            const existingItem = state.items.find(item => item._id === _id);
            if (existingItem) {
                Object.assign(existingItem, action.payload); // Mutating state directly, correct usage with Immer
            }
        },
        removeItem: (state: Draft<DataState>, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item._id !== action.payload); // Correct usage with Immer
        },
        setItems: (state: Draft<DataState>, action: PayloadAction<RentalItem[]>) => {
            state.items = action.payload;
          },
    },
    extraReducers: builder => {
        builder
            .addCase(getItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getItems.fulfilled, (state, action: PayloadAction<RentalItem[]>) => {
                state.status = 'succeeded';
                state.items = action.payload; // Correct usage with Immer
            })
            .addCase(getItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unknown error'; // Correct usage with Immer
            });
    },
});

export const { addItem, updateItem, removeItem, setItems } = dataSlice.actions;

export default dataSlice.reducer; 

