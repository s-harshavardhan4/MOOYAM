'use client'
import { Search, ShoppingCart, LogOut, User, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {

    const router = useRouter();
    const { data: session } = useSession();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist?.total || 0)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="relative bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-pink-100 shadow-sm">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className="relative text-3xl font-bold text-[#2C2C2C] font-serif tracking-widest uppercase">
                        MOO<span className="text-[#D4A398] font-light italic">YAM</span><span className="text-[#D4A398] text-3xl leading-0">.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-[#2C2C2C] font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#D4A398] transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-[#D4A398] transition-colors">Shop</Link>
                        <Link href="/about" className="hover:text-[#D4A398] transition-colors">About</Link>
                        <Link href="/#contact" className="hover:text-[#D4A398] transition-colors">Contact</Link>
                        <Link href="/orders" className="hover:text-[#D4A398] transition-colors">My Orders</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-[#F9F3F1] border border-[#D4A398]/30 px-4 py-2.5 rounded-full focus-within:border-[#D4A398] transition-colors">
                            <Search size={18} className="text-[#D4A398]" />
                            <input className="w-full bg-transparent outline-none placeholder-[#D4A398]/70 text-[#2C2C2C]" type="text" placeholder="Search skincare..." value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <div className="flex items-center gap-4 lg:gap-6">
                            <Link href="/account?tab=saved" className="relative flex items-center gap-2 text-[#2C2C2C] hover:text-[#D4A398] transition-colors">
                                <Heart size={20} />
                                {wishlistCount > 0 && <button className="absolute -top-1.5 -right-2 text-[9px] font-bold text-white bg-[#D4A398] size-4 rounded-full flex items-center justify-center">{wishlistCount}</button>}
                            </Link>

                            <Link href="/cart" className="relative flex items-center gap-2 text-[#2C2C2C] hover:text-[#D4A398] transition-colors">
                                <ShoppingCart size={20} />
                                <span className="font-medium">Cart</span>
                                <button className="absolute -top-1.5 left-3.5 text-[9px] font-bold text-white bg-[#D4A398] size-4 rounded-full flex items-center justify-center">{cartCount}</button>
                            </Link>
                        </div>

                        {session ? (
                            <div className="flex items-center gap-3">
                                <Link href="/account" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 truncate max-w-[150px] hover:text-[#D4A398] transition-colors group">
                                    <User size={16} className="text-[#D4A398] group-hover:scale-110 transition-transform" />
                                    Hi, {session.user?.name?.split(' ')[0]}
                                </Link>
                                <button onClick={() => signOut()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-red-500" title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="px-8 py-2 bg-white hover:bg-[#D4A398] hover:text-white transition text-[#D4A398] rounded-full border border-[#D4A398] font-medium tracking-wide shadow-sm block">
                                Login
                            </Link>
                        )}

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden flex items-center gap-2">
                        {session ? (
                            <>
                                <Link href="/account?tab=saved" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                                    <Heart size={20} />
                                    {wishlistCount > 0 && <span className="absolute top-0 right-0 text-[9px] font-bold text-white bg-[#D4A398] size-4 rounded-full flex items-center justify-center">{wishlistCount}</span>}
                                </Link>
                                <Link href="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                                    <User size={20} />
                                </Link>
                                <button onClick={() => signOut()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-red-500">
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="px-7 py-1.5 bg-white hover:bg-[#D4A398] text-sm transition text-[#D4A398] rounded-full border border-[#D4A398] inline-block">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar