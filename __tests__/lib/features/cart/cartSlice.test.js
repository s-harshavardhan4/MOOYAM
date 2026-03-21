import cartReducer, { addToCart, removeFromCart, deleteItemFromCart, clearCart } from '../../../../lib/features/cart/cartSlice';

describe('cartSlice', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            total: 0,
            cartItems: {},
        };
    });

    it('should return the initial state', () => {
        expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addToCart for a new item', () => {
        const action = addToCart({ productId: 'p1' });
        const state = cartReducer(initialState, action);
        
        expect(state.total).toBe(1);
        expect(state.cartItems['p1']).toBe(1);
    });

    it('should handle addToCart for an existing item', () => {
        let state = cartReducer(initialState, addToCart({ productId: 'p1' }));
        state = cartReducer(state, addToCart({ productId: 'p1' }));
        
        expect(state.total).toBe(2);
        expect(state.cartItems['p1']).toBe(2);
    });

    it('should handle removeFromCart for an existing item with quantity > 1', () => {
        let state = cartReducer(initialState, addToCart({ productId: 'p1' }));
        state = cartReducer(state, addToCart({ productId: 'p1' }));
        
        state = cartReducer(state, removeFromCart({ productId: 'p1' }));
        
        expect(state.total).toBe(1);
        expect(state.cartItems['p1']).toBe(1);
    });

    it('should handle removeFromCart and remove item when quantity reaches 0', () => {
        let state = cartReducer(initialState, addToCart({ productId: 'p1' }));
        state = cartReducer(state, removeFromCart({ productId: 'p1' }));
        
        expect(state.total).toBe(0);
        expect(state.cartItems['p1']).toBeUndefined();
    });

    it('should handle deleteItemFromCart to completely remove an item regardless of quantity', () => {
        let state = cartReducer(initialState, addToCart({ productId: 'p1' }));
        state = cartReducer(state, addToCart({ productId: 'p1' }));
        state = cartReducer(state, addToCart({ productId: 'p2' }));
        
        // total is 3 at this point
        state = cartReducer(state, deleteItemFromCart({ productId: 'p1' }));
        
        expect(state.total).toBe(1);
        expect(state.cartItems['p1']).toBeUndefined();
        expect(state.cartItems['p2']).toBe(1);
    });

    it('should handle clearCart', () => {
        let state = cartReducer(initialState, addToCart({ productId: 'p1' }));
        state = cartReducer(state, addToCart({ productId: 'p2' }));
        
        state = cartReducer(state, clearCart());
        
        expect(state).toEqual(initialState);
    });
});
