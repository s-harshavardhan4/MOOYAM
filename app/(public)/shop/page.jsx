'use client'
import { Suspense, useState, useEffect } from "react"
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

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [subFilter, setSubFilter] = useState('All')

    // Available subCategories depend on the selected category
    const dynamicSubCategories = ['All', ...new Set(products
        .filter(p => categoryFilter === 'All' || p.category === categoryFilter)
        .map(p => p.subCategory)
        .filter(Boolean)
    )]

    // Reset subFilter when category changes
    useEffect(() => {
        setSubFilter('All')
    }, [categoryFilter])

    const filteredProducts = products.filter(product => {
        const matchesSearch = search ? product.name.toLowerCase().includes(search.toLowerCase()) : true;
        const matchesCategory = categoryFilter === 'All' ? true : product.category === categoryFilter;
        const matchesSub = subFilter === 'All' ? true : product.subCategory === subFilter;
        return matchesSearch && matchesCategory && matchesSub && product.inStock;
    });

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> {search && <MoveLeftIcon size={20} />}  {categoryFilter === 'All' ? 'Our' : categoryFilter} <span className="text-[#D4A398] font-medium">Collection</span></h1>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-5 py-1.5 rounded-full border transition-all text-sm font-medium ${categoryFilter === cat ? 'bg-slate-700 text-white border-slate-700 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-700 hover:text-slate-700'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Subcategory Tabs (Only show if there are actual subcategories to filter) */}
                {dynamicSubCategories.length > 1 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                        {dynamicSubCategories.map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSubFilter(sub)}
                                className={`px-6 py-2 rounded-full border transition-all text-sm font-medium ${subFilter === sub ? 'bg-[#D4A398] text-white border-[#D4A398] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#D4A398] hover:text-[#D4A398]'}`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}
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