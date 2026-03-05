'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { MoveLeftIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Product() {

    const { productId } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState();
    const products = useSelector(state => state.product.list);

    const fetchProduct = async () => {
        const product = products.find((product) => product.id === productId);
        setProduct(product);
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId, products]);

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums & Back Button */}
                <div className="flex items-center gap-4 mt-8 mb-4">
                    <button onClick={() => router.back()} className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-[#D4A398] hover:text-white hover:border-[#D4A398] transition-all shadow-sm">
                        <MoveLeftIcon size={20} />
                    </button>
                    <div className="text-gray-600 text-sm font-medium">
                        Home / Products / <span className="text-[#D4A398]">{product?.category}</span>
                    </div>
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}