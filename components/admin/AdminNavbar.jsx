'use client'
import Link from "next/link"
import { LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"

const AdminNavbar = () => {


    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
            <Link href="/" className="relative text-3xl font-bold text-[#2C2C2C] font-serif tracking-widest uppercase">
                MOO<span className="text-[#D4A398] font-light italic">YAM</span><span className="text-[#D4A398] text-3xl leading-0">.</span>
                <p className="absolute text-xs font-semibold -top-2 -right-14 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-[#D4A398] shadow-sm tracking-normal font-sans">
                    Admin
                </p>
            </Link>
            <div className="flex items-center gap-4">
                <p>Hi, Admin</p>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                    <LogOutIcon size={16} />
                    Logout
                </button>
            </div>
        </div>
    )
}

export default AdminNavbar