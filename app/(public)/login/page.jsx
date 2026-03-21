'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success('Signed in successfully');
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-soft flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Image Section */}
                <div className="md:w-1/2 relative min-h-[400px] md:min-h-auto hidden md:block">
                    <Image
                        src="/login-bg.png"
                        alt="Luxurious skincare cream jar"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-10 left-10 right-10 text-white">
                        <h2 className="text-4xl font-serif mb-3 leading-tight">Elevate Your<br />Routine</h2>
                        <p className="font-sans text-sm opacity-90 max-w-sm leading-relaxed">Discover our premium, dermatologist-approved formulations designed for visibly radiant skin.</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                    <div className="mb-10">
                        <h1 className="text-4xl font-serif text-rich-black mb-3">Welcome Back</h1>
                        <p className="text-gray-500 font-sans text-sm">Please enter your details to access your account.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-rich-black mb-2" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-pink-soft/20 font-sans"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-rich-black" htmlFor="password">Password</label>
                                <Link href="#" className="text-xs text-gold font-medium hover:text-gold-dark transition-colors">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-pink-soft/20 font-sans"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gold hover:bg-gold-dark text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-8 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center space-x-4">
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                        <span className="text-xs text-gray-400 font-sans uppercase tracking-wider">Or</span>
                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                    </div>

                    <p className="text-center mt-8 text-sm text-gray-600 font-sans">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-gold font-medium hover:underline transition-all">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
