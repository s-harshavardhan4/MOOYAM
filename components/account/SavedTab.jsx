'use client';
import { useSelector } from "react-redux";
import { Heart, SearchX } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function SavedTab() {
    const { items: savedProducts, status } = useSelector(state => state.wishlist);

    if (status === 'loading') {
        return <div className="py-20 flex justify-center"><Loading /></div>;
    }

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Saved Items</h2>

            {savedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                        <Heart size={32} className="text-[#D4A398]" fill="none" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No saved items yet</h3>
                    <p className="text-gray-500 text-sm max-w-sm mb-6">Explore our collections and tap the heart icon to save products you love for later.</p>
                    <Link href="/shop" className="px-6 py-2.5 bg-[#D4A398] hover:bg-[#c29186] text-white rounded-full text-sm font-medium transition-colors shadow-sm shadow-[#D4A398]/30">
                        Explore Shop
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
