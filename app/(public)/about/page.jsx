'use client'
import { motion } from 'framer-motion'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import { CheckCircle2, Heart, ShieldCheck, Truck } from 'lucide-react'

export default function About() {

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const features = [
        { icon: ShieldCheck, title: "Authentic Quality", desc: "Every thread tells a story of genuine craftsmanship." },
        { icon: Heart, title: "Curated with Love", desc: "Handpicked designs that blend tradition with modern trends." },
        { icon: Truck, title: "Global Shipping", desc: "Delivering elegance to your doorstep, anywhere in the world." },
        { icon: CheckCircle2, title: "Satisfaction Guaranteed", desc: "Your happiness is our priority, or your money back." },
    ]

    return (
        <div className="bg-[#FCFAFA] min-h-screen text-[#2C2C2C] overflow-hidden">

            {/* Hero Section */}
            <section className="relative py-20 px-6 md:px-12 lg:px-20 flex flex-col items-center text-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="max-w-4xl z-10"
                >
                    <span className="text-[#D4A398] font-bold tracking-widest uppercase text-sm mb-4 block">Our Philosophy</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-[#2C2C2C] leading-tight">
                        Science meets nature for <br /> <span className="text-[#C69C6D] italic">Luminous Beauty.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#2C2C2C]/80 leading-relaxed font-light max-w-2xl mx-auto">
                        At <span className="font-semibold text-[#D4A398]">MOOYAM</span>, we believe that skincare is an essential form of self-care. It's about revealing your most radiant, natural self.
                    </p>
                </motion.div>

                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-0">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#D4A398] rounded-full blur-3xl opacity-10"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-[#C69C6D] rounded-full blur-3xl opacity-10"
                    />
                </div>
            </section>

            {/* Split Section: Image & Text */}
            <section className="py-16 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/products/MOOYAM.jpeg"
                                alt="MOOYAM Heritage"
                                width={600}
                                height={800}
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Floating Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="absolute -bottom-6 -right-6 bg-white p-6 rounded-full shadow-xl border border-[#D4A398]/30 flex flex-col items-center justify-center w-32 h-32 text-center"
                        >
                            <span className="text-3xl font-bold text-[#D4A398]">100%</span>
                            <span className="text-xs font-semibold text-[#2C2C2C]/70 uppercase text-[10px] mt-1">Cruelty Free</span>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 space-y-6"
                    >
                        <h2 className="text-3xl font-serif font-bold text-[#2C2C2C]">Formulated for Efficacy</h2>
                        <p className="text-[#2C2C2C]/80 leading-relaxed font-light mt-4">
                            Established with a passion for clean beauty and clinically proven ingredients, MOOYAM started as an independent lab with a big dream: to make premium, high-performance skincare accessible without compromising on safety or transparency.
                        </p>
                        <p className="text-[#2C2C2C]/80 leading-relaxed font-light">
                            We meticulously source our active complexes from sustainable partners globally. From potent Vitamin C extracts to soothing botanical oils, every formula in our collection is rigorously tested for maximum visible results.
                        </p>
                        <div className="pt-4">
                            <div className="h-1 w-20 bg-[#D4A398] rounded-full"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2C2C] mb-4">Why Women Love <span className="text-[#D4A398] italic">MOOYAM</span></h2>
                        <p className="text-[#2C2C2C]/60 font-light tracking-wide">More than just skincare, we are a promise of confidence.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="p-8 rounded-2xl bg-[#F9F3F1] hover:bg-white hover:shadow-xl border border-[#D4A398]/20 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 mx-auto bg-white group-hover:bg-[#D4A398] rounded-full flex items-center justify-center shadow-sm mb-6 transition-colors duration-300">
                                    <feature.icon className="text-[#D4A398] group-hover:text-white transition-colors duration-300" size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-[#2C2C2C] mb-3">{feature.title}</h3>
                                <p className="text-sm text-[#2C2C2C]/70 leading-relaxed font-light">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-20 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto border-y border-[#D81B60]/30 py-10"
                >
                    <p className="text-2xl font-serif italic text-[#C69C6D]">
                        "True beauty is not about perfection, it's about glowing with confidence and trusting the skin you're in."
                    </p>
                </motion.div>
            </section>

        </div>
    )
}
