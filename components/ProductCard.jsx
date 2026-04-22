'use client'
import { StarIcon, EyeIcon, HeartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlistAsync } from '@/lib/features/wishlist/wishlistSlice'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const ProductCard = ({ product, className = "" }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
    const dispatch = useDispatch()
    const { data: session } = useSession()

    // Wishlist specific logic
    const wishlistIds = useSelector(state => state.wishlist?.itemIds || []);
    const isSaved = wishlistIds.includes(product.id);

    const handleWishlistToggle = async (e) => {
        e.preventDefault(); // Prevent linking to product page
        e.stopPropagation(); // Stop Next Link routing

        if (!session) {
            toast.error("Please login to save items");
            return;
        }

        try {
            const action = await dispatch(toggleWishlistAsync({ 
                productId: product.id, 
                userId: session.user.id 
            })).unwrap();
            toast.success(action.isSaved ? "Saved to Wishlist" : "Removed from Wishlist");
        } catch (error) {
            toast.error(error || "Failed to save item");
        }
    };

    // calculate the average rating of the product
    const productRatings = product.rating || [];
    const rating = productRatings.length > 0 ? Math.round(productRatings.reduce((acc, curr) => acc + curr.rating, 0) / productRatings.length) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            <Link href={`/product/${product.id}`} className='group block max-xl:mx-auto relative h-full flex flex-col'>
                <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className='bg-white border border-[#D4A398]/30 h-64 sm:h-72 rounded-xl flex items-center justify-center relative overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#D4A398]/20 transition-all duration-300'
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#F9F3F1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <Image
                        width={500}
                        height={500}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 drop-shadow-sm relative z-10'
                        src={product.images[0]}
                        alt=""
                    />

                    {/* Quick View Button Reveal */}
                    <div className='absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20'>
                        <button className='w-full bg-[#D4A398] text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-lg'>
                            <EyeIcon size={16} /> Quick View
                        </button>
                    </div>
                </motion.div>

                {/* Floating Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    aria-label={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
                    className='absolute top-3 right-3 z-30 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white text-gray-400 hover:text-[#D4A398] transition-all hover:scale-110 active:scale-95'
                >
                    <HeartIcon size={18} fill={isSaved ? "#D4A398" : "none"} color={isSaved ? "#D4A398" : "currentColor"} />
                </button>

                <div className='flex justify-between items-start gap-3 text-sm text-[#2C2C2C] pt-4 px-1'>
                    <div className="flex-1">
                        <p className='font-medium truncate group-hover:text-[#D4A398] transition-colors font-serif tracking-wide'>{product.name}</p>
                        <div className='flex items-center gap-1 mt-1'>
                            <div className='flex'>
                                {Array(5).fill('').map((_, index) => (
                                    <StarIcon key={index} size={14} className='mt-0.5' fill={rating >= index + 1 ? "#D4A398" : "#E5E7EB"} stroke="none" />
                                ))}
                            </div>
                            <span className="text-xs text-slate-400">({productRatings.length})</span>
                        </div>
                    </div>
                    <p className='font-serif font-bold text-lg text-[#D4A398]'>{currency}{product.price}</p>
                </div>
            </Link>
        </motion.div>
    )
}

export default ProductCard