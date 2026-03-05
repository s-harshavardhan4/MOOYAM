'use client'

import { usePathname } from "next/navigation"
import { HomeIcon, ListIcon, PackageIcon, PlusSquareIcon, StoreIcon, TicketPercentIcon, CreditCardIcon } from "lucide-react"
import Link from "next/link"

const AdminSidebar = () => {

    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Add Product', href: '/admin/add-product', icon: PlusSquareIcon },
        { name: 'Manage Product', href: '/admin/manage-product', icon: ListIcon },
        { name: 'Orders', href: '/admin/orders', icon: PackageIcon },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon },
        { name: 'Transactions', href: '/admin/transactions', icon: CreditCardIcon },
    ]

    return (
        <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60 bg-white">
            <div className="flex flex-col gap-3 justify-center items-center pt-8">
                <Link href="/" className="relative text-2xl font-bold text-[#2C2C2C] font-serif tracking-widest uppercase max-sm:hidden">
                    MOO<span className="text-[#D4A398] font-light italic">YAM</span><span className="text-[#D4A398] text-2xl leading-0">.</span>
                </Link>
                <p className="text-slate-500 text-sm max-sm:hidden">Hi, Admin</p>
            </div>

            <div className="max-sm:mt-6">
                {
                    sidebarLinks.map((link, index) => (
                        <Link key={index} href={link.href} className={`relative flex items-center gap-3 text-slate-500 hover:bg-[#F9F3F1] hover:text-[#D4A398] p-3 transition-all duration-300 ${pathname === link.href ? 'bg-[#F9F3F1] text-[#D4A398] font-medium border-r-2 border-[#D4A398]' : ''}`}>
                            <link.icon size={20} className={`sm:ml-5 ${pathname === link.href ? 'text-[#D4A398]' : 'text-slate-400'}`} />
                            <p className="max-sm:hidden">{link.name}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default AdminSidebar