import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch user's saved items
export const fetchWishlistAsync = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/user/wishlist');
            const data = await response.json();
            if (response.ok && data.success) {
                return data;
            } else {
                return rejectWithValue(data.message);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to toggle an item in the wishlist
export const toggleWishlistAsync = createAsyncThunk(
    'wishlist/toggleWishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/user/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                return {
                    productId,
                    isSaved: data.isSaved,
                    savedItemIds: data.savedItemIds,
                    product: data.product
                };
            } else {
                return rejectWithValue(data.message);
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],          // The actual product objects
        itemIds: [],        // Just the array of string IDs for quick O(1) checking
        total: 0,
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Statuses
            .addCase(fetchWishlistAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWishlistAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.savedItems || [];
                state.itemIds = action.payload.savedItemIds || [];
                state.total = state.itemIds.length;
            })
            .addCase(fetchWishlistAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Toggle Statuses
            .addCase(toggleWishlistAsync.fulfilled, (state, action) => {
                const { productId, isSaved, savedItemIds, product } = action.payload;

                // Update the IDs list directly from the server response
                state.itemIds = savedItemIds;
                state.total = savedItemIds.length;

                // If it was removed, filter it out of our populated items array
                if (!isSaved) {
                    state.items = state.items.filter(item => item.id !== productId);
                }
                // If it was added, and we got the product back, add it to the items array
                else if (product) {
                    const exists = state.items.find(item => item.id === product.id);
                    if (!exists) {
                        state.items.push(product);
                    }
                }
            });
    }
});

export default wishlistSlice.reducer;
