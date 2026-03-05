'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Title = ({ title, description, visibleButton = true, href = '' }) => {

    return (
        <div className='flex flex-col items-center'>
            <h2 className='text-3xl font-serif font-semibold text-[#2C2C2C] italic'>{title}</h2>
            <Link href={href} className='flex items-center gap-5 text-sm text-slate-500 mt-2 hover:text-[#D4A398] transition-colors'>
                <p className='max-w-lg text-center tracking-wide font-light'>{description}</p>
                {visibleButton && <button className='text-[#D4A398] flex items-center gap-1 hover:underline'>View more <ArrowRight size={14} /></button>}
            </Link>
        </div>
    )
}

export default Title