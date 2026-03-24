'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const Counter = ({ productId, max }) => {

    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        if (cartItems[productId] >= max) {
            toast.error(`Only ${max} units available in stock`, { id: 'stock-limit' });
            return;
        }
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none hover:text-red-500 transition-colors">-</button>
            <p className="p-1 min-w-[1.5rem] text-center">{cartItems[productId]}</p>
            <button 
                onClick={addToCartHandler} 
                disabled={cartItems[productId] >= max}
                className={`p-1 select-none transition-colors ${cartItems[productId] >= max ? 'text-slate-300 cursor-not-allowed' : 'hover:text-[#D4A398]'}`}
            >
                +
            </button>
        </div>
    )
}

export default Counter