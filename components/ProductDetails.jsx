import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon, HeartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistAsync } from "@/lib/features/wishlist/wishlistSlice";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter()
    const { data: session } = useSession()

    const [mainImage, setMainImage] = useState(product.images[0]);

    // Wishlist specific logic
    const wishlistIds = useSelector(state => state.wishlist?.itemIds || []);
    const isSaved = wishlistIds.includes(productId);

    const handleWishlistToggle = async () => {
        if (!session) {
            toast.error("Please login to save items");
            return;
        }

        try {
            const action = await dispatch(toggleWishlistAsync(productId)).unwrap();
            toast.success(action.isSaved ? "Saved to Wishlist" : "Removed from Wishlist");
        } catch (error) {
            toast.error(error || "Failed to save item");
        }
    };

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const productRatings = product.rating || [];
    const averageRating = productRatings.length > 0 ? productRatings.reduce((acc, item) => acc + item.rating, 0) / productRatings.length : 0;

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-[#F9F3F1] border border-[#D4A398]/30 flex items-center justify-center size-26 rounded-lg group cursor-pointer overflow-hidden p-2">
                            <Image src={image} className="w-full h-full object-contain group-hover:scale-110 group-active:scale-95 transition-transform duration-300" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center w-full sm:w-[500px] aspect-square bg-[#FCFAFA] border border-[#D4A398]/20 rounded-lg overflow-hidden shadow-sm">
                    <Image src={mainImage} alt="" className="w-full h-full object-cover" width={500} height={500} />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-serif font-semibold text-[#2C2C2C]">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='mt-0.5' fill={averageRating >= index + 1 ? "#D4A398" : "#F3F4F6"} stroke="none" />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{productRatings.length} Reviews</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product.price} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>
                {product.inStock && product.quantity > 0 && product.quantity < 5 && (
                    <p className="text-red-600 text-sm mt-3 font-medium">Only {product.quantity} units left! Order soon.</p>
                )}
                {!product.inStock || product.quantity <= 0 ? (
                     <p className="text-red-600 text-sm mt-3 font-medium">Currently Out of Stock</p>
                ) : null}
                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-[#2C2C2C] font-serif font-medium">Quantity</p>
                                <Counter productId={productId} max={product.quantity} />
                            </div>
                        )
                    }
                    <button 
                        onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')} 
                        disabled={!product.inStock || product.quantity <= 0}
                        className={`px-10 py-3 text-sm font-medium rounded-full shadow-md transition-all active:scale-95 ${
                            (!product.inStock || product.quantity <= 0) 
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                            : 'bg-[#D4A398] text-white shadow-[#D4A398]/30 hover:bg-[#C69C6D]'
                        }`}
                    >
                        {(!product.inStock || product.quantity <= 0) ? 'Out of Stock' : (!cart[productId] ? 'Add to Cart' : 'View Cart')}
                    </button>
                    <button onClick={handleWishlistToggle} className="h-11 px-6 rounded-full border border-[#D4A398]/30 flex items-center justify-center text-[#D4A398] bg-white hover:bg-[#F9F3F1] transition-colors shadow-sm">
                        <HeartIcon size={20} fill={isSaved ? "#D4A398" : "none"} />
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails