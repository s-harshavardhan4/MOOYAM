'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Home, ShoppingBag } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-pink-soft flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
                <div className="relative w-48 h-48 mx-auto mb-8">
                    <Image
                        src="/products/MOOYAM.jpeg"
                        alt="MOOYAM"
                        fill
                        className="object-contain rounded-2xl opacity-20"
                        priority
                    />
                </div>
                
                <h1 className="text-8xl font-serif font-bold text-[#D4A398] mb-4">404</h1>
                
                <h2 className="text-2xl font-serif text-[#2C2C2C] mb-4">
                    Page Not Found
                </h2>
                
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#D4A398] text-white rounded-full font-medium hover:bg-[#c49a8a] transition-colors"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                    
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#D4A398] border border-[#D4A398] rounded-full font-medium hover:bg-[#F9F3F1] transition-colors"
                    >
                        <ShoppingBag size={18} />
                        Browse Shop
                    </Link>
                </div>
                
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 inline-flex items-center gap-2 text-gray-500 hover:text-[#D4A398] transition-colors"
                >
                    <ArrowLeft size={16} />
                    Go Back
                </button>
            </div>
        </div>
    )
}
