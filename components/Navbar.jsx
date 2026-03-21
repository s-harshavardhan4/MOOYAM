'use client'
import { Search, ShoppingCart, LogOut, User, Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {

    const router = useRouter();
    const { data: session } = useSession();

    const [search, setSearch] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const cartCount = useSelector(state => state.cart.total)
    const wishlistCount = useSelector(state => state.wishlist?.total || 0)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
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
                                    {wishlistCount > 0 && <span className="absolute -top-1.5 -right-2 text-[9px] font-bold text-white bg-[#D4A398] size-4 rounded-full flex items-center justify-center">{wishlistCount}</span>}
                                </Link>

                                <Link href="/cart" className="relative flex items-center gap-2 text-[#2C2C2C] hover:text-[#D4A398] transition-colors">
                                    <ShoppingCart size={20} />
                                    <span className="font-medium">Cart</span>
                                    {cartCount > 0 && <span className="absolute -top-1.5 left-3.5 text-[9px] font-bold text-white bg-[#D4A398] size-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                                </Link>
                            </div>

                            {session ? (
                                <div className="flex items-center gap-3">
                                    <Link href="/account" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 truncate max-w-[150px] hover:text-[#D4A398] transition-colors group">
                                        <User size={16} className="text-[#D4A398] group-hover:scale-110 transition-transform" />
                                        Hi, {session.user?.name?.split(' ')[0]}
                                    </Link>
                                    <button onClick={handleSignOut} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-red-500" title="Logout">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="px-8 py-2 bg-white hover:bg-[#D4A398] hover:text-white transition text-[#D4A398] rounded-full border border-[#D4A398] font-medium tracking-wide shadow-sm block">
                                    Login
                                </Link>
                            )}

                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                        onClick={closeMobileMenu}
                    />
                    <div className="fixed top-[72px] left-0 right-0 bg-white z-50 sm:hidden shadow-lg border-b border-pink-100">
                        <div className="mx-6 py-4 space-y-4">
                            <form onSubmit={handleSearch} className="flex items-center w-full text-sm gap-2 bg-[#F9F3F1] border border-[#D4A398]/30 px-4 py-2.5 rounded-full">
                                <Search size={18} className="text-[#D4A398]" />
                                <input className="w-full bg-transparent outline-none placeholder-[#D4A398]/70 text-[#2C2C2C]" type="text" placeholder="Search skincare..." value={search} onChange={(e) => setSearch(e.target.value)} required />
                            </form>

                            <div className="flex flex-col gap-3 text-[#2C2C2C] font-medium">
                                <Link href="/" onClick={closeMobileMenu} className="hover:text-[#D4A398] transition-colors py-2">Home</Link>
                                <Link href="/shop" onClick={closeMobileMenu} className="hover:text-[#D4A398] transition-colors py-2">Shop</Link>
                                <Link href="/about" onClick={closeMobileMenu} className="hover:text-[#D4A398] transition-colors py-2">About</Link>
                                <Link href="/#contact" onClick={closeMobileMenu} className="hover:text-[#D4A398] transition-colors py-2">Contact</Link>
                                <Link href="/orders" onClick={closeMobileMenu} className="hover:text-[#D4A398] transition-colors py-2">My Orders</Link>
                            </div>

                            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                                <Link href="/cart" onClick={closeMobileMenu} className="relative flex items-center gap-2 text-[#2C2C2C]">
                                    <ShoppingCart size={20} />
                                    <span className="font-medium">Cart</span>
                                    {cartCount > 0 && <span className="text-[9px] font-bold text-white bg-[#D4A398] size-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                                </Link>

                                <Link href="/account?tab=saved" onClick={closeMobileMenu} className="relative flex items-center gap-2 text-[#2C2C2C]">
                                    <Heart size={20} />
                                    {wishlistCount > 0 && <span className="text-[9px] font-bold text-white bg-[#D4A398] size-4 rounded-full flex items-center justify-center">{wishlistCount}</span>}
                                </Link>
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                {session ? (
                                    <div className="flex items-center justify-between">
                                        <Link href="/account" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <User size={18} className="text-[#D4A398]" />
                                            Hi, {session.user?.name?.split(' ')[0]}
                                        </Link>
                                        <button onClick={handleSignOut} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-red-500">
                                            <LogOut size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <Link href="/login" onClick={closeMobileMenu} className="block w-full text-center px-6 py-2.5 bg-[#D4A398] text-white rounded-full font-medium">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Navbar
