'use client'
import { Suspense, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

function ShopContent() {

    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)

    const [subFilter, setSubFilter] = useState('All')

    const filteredProducts = products.filter(product => {
        const matchesSearch = search ? product.name.toLowerCase().includes(search.toLowerCase()) : true;
        const matchesSub = subFilter === 'All' ? true : product.subCategory === subFilter;
        return matchesSearch && matchesSub && product.inStock;
    });

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> {search && <MoveLeftIcon size={20} />}  SkinCare <span className="text-[#D4A398] font-medium">Collection</span></h1>

                {/* Subcategory Tabs */}
                <div className="flex gap-3 mb-8">
                    {['All', 'Creams', 'Serums'].map(sub => (
                        <button
                            key={sub}
                            onClick={() => setSubFilter(sub)}
                            className={`px-6 py-2 rounded-full border transition-all text-sm font-medium ${subFilter === sub ? 'bg-[#D4A398] text-white border-[#D4A398] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#D4A398] hover:text-[#D4A398]'}`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-12 mx-auto mb-32">
                    {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
            </div>
        </div>
    )
}


export default function Shop() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}