'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import CategoriesMarquee from './CategoriesMarquee'
import { motion } from 'framer-motion'

const Hero = () => {

    const router = useRouter()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    }

    const imageVariants = {
        hidden: { scale: 0.8, opacity: 0, x: 50 },
        visible: {
            scale: 1,
            opacity: 1,
            x: 0,
            transition: {
                duration: 1,
                ease: "easeOut"
            }
        }
    }

    return (
        <div className='mx-6 overflow-hidden'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className='relative flex-1 bg-[#F9F3F1] border border-[#D4A398]/30 rounded-3xl group shadow-sm hover:shadow-xl transition-shadow duration-500 overflow-hidden min-h-[500px] flex flex-col md:flex-row items-center'
                >
                    {/* Floating Background Effects */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ duration: 2 }}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    >
                        <motion.div
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-10 w-64 h-64 bg-[#D4A398] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                        />
                        <motion.div
                            animate={{ y: [0, 30, 0], x: [0, -10, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-10 left-10 w-72 h-72 bg-[#C69C6D] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                        />
                    </motion.div>

                    <div className='p-8 md:pl-16 md:pr-4 relative z-10 w-full md:w-1/2 flex flex-col justify-center items-start'>
                        <motion.div variants={itemVariants} onClick={() => router.push('/shop')} className='inline-flex items-center gap-3 bg-white border border-[#D4A398]/30 text-[#D4A398] pr-4 p-1 rounded-full text-xs sm:text-sm shadow-sm backdrop-blur-sm cursor-pointer'>
                            <span className='bg-[#D4A398] px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs font-medium tracking-wide'>NEW</span> <span className="font-serif italic font-medium">Free Shipping on Orders Above {currency}500!</span> <ChevronRightIcon className='group-hover:ml-2 transition-all text-[#D4A398]' size={16} />
                        </motion.div>

                        <motion.h2 variants={itemVariants} className='text-4xl sm:text-6xl/tight my-6 font-bold font-serif text-[#2C2C2C]'>
                            Radiant Skin. <br />
                            <span className="bg-gradient-to-r from-[#D4A398] to-[#C69C6D] bg-clip-text text-transparent italic">Pure Elegance.</span>
                        </motion.h2>

                        <motion.div variants={itemVariants} className='text-[#2C2C2C] text-sm font-medium mt-2'>
                            <p className="uppercase tracking-widest text-xs text-slate-400 mb-1">Collections start from</p>
                            <p className='text-4xl font-serif text-[#D4A398]'>{currency}24.00</p>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/shop')}
                            className='bg-white text-[#D4A398] border border-[#D4A398] text-sm font-medium py-3 px-8 mt-8 rounded-full hover:bg-[#D4A398] hover:text-white transition-colors shadow-lg shadow-[#D4A398]/20'
                        >
                            EXPLORE COLLECTION
                        </motion.button>
                    </div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={imageVariants}
                        className='w-full md:w-1/2 h-full flex items-center justify-center relative p-4'
                    >
                        <Image className='w-full max-h-[500px] object-contain drop-shadow-2xl' width={600} height={600} src={assets.hero_model_img} alt="Elegant Model" priority />
                    </motion.div>
                </motion.div>

                {/* Side Cards */}
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        onClick={() => router.push('/shop')}
                        className='flex-1 flex items-center justify-between w-full bg-[#FCF8F7] border border-[#D4A398]/30 rounded-3xl p-6 px-8 group hover:shadow-lg transition-all cursor-pointer'
                    >
                        <div>
                            <p className='text-3xl font-serif font-medium text-[#2C2C2C] italic'>New Serums</p>
                            <p className='flex items-center gap-1 mt-3 text-[#D4A398] uppercase tracking-wide text-xs font-bold'>Shop now <ArrowRightIcon className='group-hover:ml-2 transition-all' size={16} /> </p>
                        </div>
                        <Image className='w-32 drop-shadow-sm group-hover:scale-110 object-cover rounded transition-transform duration-500' width={128} height={128} src="/products/acne_serum(2).jpeg" alt="" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        whileHover={{ y: -5 }}
                        onClick={() => router.push('/shop')}
                        className='flex-1 flex items-center justify-between w-full bg-[#F9F3F1] border border-[#D4A398]/30 rounded-3xl p-6 px-8 group hover:shadow-lg transition-all cursor-pointer'
                    >
                        <div>
                            <p className='text-3xl font-serif font-medium text-[#2C2C2C] italic'>Holiday Sets</p>
                            <p className='flex items-center gap-1 mt-3 text-[#D4A398] uppercase tracking-wide text-xs font-bold'>Shop now <ArrowRightIcon className='group-hover:ml-2 transition-all' size={16} /> </p>
                        </div>
                        <Image className='w-32 drop-shadow-sm group-hover:scale-110 object-cover rounded transition-transform duration-500' width={128} height={128} src="/products/anti_acne_set.png" alt="" />
                    </motion.div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Hero