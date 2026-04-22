'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useSelector } from "react-redux"
import ProductCard from "./ProductCard"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { fetchFromApi } from "@/lib/api-client"

const ProductDescription = ({ product }) => {

    const { data: session } = useSession()
    const [selectedTab, setSelectedTab] = useState('Description')
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [reviewText, setReviewText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const products = useSelector(state => state.product.list)

    const relatedProducts = products
        .filter(item => item.category === product.category && item.id !== product.id)
        .slice(0, 4)

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }
        if (!reviewText.trim()) {
            toast.error("Please enter a review")
            return
        }

        setIsSubmitting(true)
        try {
            await fetchFromApi('/api/user/review', {
                method: 'POST',
                body: {
                    productId: product.id,
                    rating,
                    review: reviewText,
                    userId: session.user.id
                }
            })

            toast.success("Review submitted successfully!")
            setIsReviewFormOpen(false)
            setRating(0)
            setReviewText('')
            window.location.reload() // Reload to show the new review
        } catch (error) {
            console.error("Error submitting review:", error)
            toast.error(error.message || "An error occurred while submitting")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="my-18 text-sm text-slate-600">

            {/* Tabs & Add Review Button */}
            <div className="flex items-center justify-between border-b border-slate-200 mb-6 max-w-2xl">
                <div className="flex">
                    {['Description', 'Reviews'].map((tab, index) => (
                        <button className={`${tab === selectedTab ? 'border-b-[1.5px] font-semibold text-[#D81B60] border-[#D81B60]' : 'text-slate-400'} px-3 py-2 font-medium`} key={index} onClick={() => setSelectedTab(tab)}>
                            {tab}
                        </button>
                    ))}
                </div>
                {selectedTab === 'Reviews' && session?.user && (
                    <button onClick={() => setIsReviewFormOpen(!isReviewFormOpen)} className="text-[#D81B60] font-medium hover:underline text-sm px-3 py-2">
                        {isReviewFormOpen ? 'Cancel' : '+ Add Review'}
                    </button>
                )}
            </div>

            {/* Description */}
            {selectedTab === "Description" && (
                <p className="max-w-xl">{product.description}</p>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-3 mt-8">
                    {isReviewFormOpen && (
                        <form onSubmit={handleReviewSubmit} className="mb-10 p-6 border border-slate-200 rounded-lg max-w-2xl bg-slate-50">
                            <h4 className="font-semibold text-lg text-slate-800 mb-4">Write a Review</h4>
                            <div className="flex items-center mb-4">
                                <span className="mr-3 font-medium">Rating:</span>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        size={24}
                                        className={`cursor-pointer ${rating >= star ? 'text-[#00C950]' : 'text-slate-300'} mr-1`}
                                        fill={rating >= star ? '#00C950' : 'none'}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                            <textarea
                                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#D81B60] mb-4"
                                rows="4"
                                placeholder="Share your thoughts about this product..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            ></textarea>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#D81B60] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#b0164e] transition disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {(product.rating || []).length > 0 ? (
                        (product.rating || []).map((item, index) => (
                            <div key={index} className="flex gap-5 mb-10">
                                <Image src={item.user?.image || "/default-avatar.png"} alt="" className="size-10 rounded-full" width={100} height={100} />
                                <div>
                                    <div className="flex items-center" >
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon key={index} size={18} className='text-transparent mt-0.5' fill={item.rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                                        ))}
                                    </div>
                                    <p className="text-sm max-w-lg my-4">{item.review}</p>
                                    <p className="font-medium text-slate-800">{item.user?.name || "Anonymous User"}</p>
                                    <p className="mt-3 font-light">{new Date(item.createdAt).toDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-400">No reviews yet.</p>
                    )}
                </div>
            )}

            {/* Related Products Section */}
            <div className="mt-20">
                <h3 className="text-xl font-serif font-bold text-[#4A4A4A] mb-8">Related Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {relatedProducts.length > 0 ? (
                        relatedProducts.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-slate-400">No related products found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductDescription