import productReducer, { setProduct, clearProduct } from '../../../../lib/features/product/productSlice';

describe('productSlice', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            list: [],
        };
    });

    it('should return origin initial state', () => {
        expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setProduct', () => {
        const dummyProducts = [
            { id: '1', title: 'Product 1' },
            { id: '2', title: 'Product 2' }
        ];
        
        const state = productReducer(initialState, setProduct(dummyProducts));
        
        expect(state.list).toEqual(dummyProducts);
    });

    it('should handle clearProduct', () => {
        const initialStateWithProducts = {
            list: [{ id: '1', title: 'Product 1' }]
        };
        
        const state = productReducer(initialStateWithProducts, clearProduct());
        
        expect(state.list).toEqual([]);
    });
});
