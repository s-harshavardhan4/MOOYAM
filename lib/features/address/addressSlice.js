import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import { fetchFromApi } from '@/lib/api-client'

export const fetchAddressesAsync = createAsyncThunk(
    'address/fetchAddresses',
    async (userId, { rejectWithValue }) => {
        try {
            if (!userId) return rejectWithValue('User ID is required');
            const data = await fetchFromApi(`/api/address?userId=${userId}`);
            return data.addresses;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addAddressAsync = createAsyncThunk(
    'address/addAddress',
    async ({ addressData, userId }, { rejectWithValue }) => {
        try {
            if (!userId) return rejectWithValue('User ID is required');
            const data = await fetchFromApi('/api/address', {
                method: 'POST',
                body: { ...addressData, userId }
            });
            return data.address;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateAddressAsync = createAsyncThunk(
    'address/updateAddress',
    async ({ id, addressData, userId }, { rejectWithValue }) => {
        try {
            if (!userId) return rejectWithValue('User ID is required');
            const data = await fetchFromApi(`/api/address/${id}`, {
                method: 'PUT',
                body: { ...addressData, userId }
            });
            return data.address;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteAddressAsync = createAsyncThunk(
    'address/deleteAddress',
    async ({ id, userId }, { rejectWithValue }) => {
        try {
            if (!userId) return rejectWithValue('User ID is required');
            await fetchFromApi(`/api/address/${id}`, {
                method: 'DELETE',
                body: { userId }
            });
            return id;
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
            })
            .addCase(updateAddressAsync.fulfilled, (state, action) => {
                const index = state.list.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteAddressAsync.fulfilled, (state, action) => {
                state.list = state.list.filter(a => a.id !== action.payload);
            });
    }
})

export const { addAddress } = addressSlice.actions

export default addressSlice.reducer