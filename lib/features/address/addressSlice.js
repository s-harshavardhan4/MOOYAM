import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'

export const fetchAddressesAsync = createAsyncThunk(
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/address');
            const data = await response.json();
            if (response.ok) {
                return data.addresses;
            } else {
                return rejectWithValue(data.message);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addAddressAsync = createAsyncThunk(
    'address/addAddress',
    async (addressData, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/address', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });
            const data = await response.json();
            if (response.ok) {
                return data.address;
            } else {
                return rejectWithValue(data.message);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
        status: 'idle',
        error: null
    },
    reducers: {
        // Fallback synchronous action if needed
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddressesAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAddressesAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchAddressesAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addAddressAsync.fulfilled, (state, action) => {
                state.list.unshift(action.payload); // Add to top of list
            });
    }
})

export const { addAddress } = addressSlice.actions

export default addressSlice.reducer