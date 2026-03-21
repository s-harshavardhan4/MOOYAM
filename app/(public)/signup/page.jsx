'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (formData.password.length < 8) {
                throw new Error("Password must be at least 8 characters");
            }
            if (!/[A-Z]/.test(formData.password)) {
                throw new Error("Password must contain at least one uppercase letter");
            }
            if (!/[a-z]/.test(formData.password)) {
                throw new Error("Password must contain at least one lowercase letter");
            }
            if (!/[0-9]/.test(formData.password)) {
                throw new Error("Password must contain at least one number");
            }

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            toast.success('Account created successfully! Please sign in.');
            router.push('/login');

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-soft flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row-reverse">

                {/* Image Section - Right Side For Signup */}
                <div className="md:w-1/2 relative min-h-[400px] md:min-h-auto hidden md:block">
                    <Image
                        src="/login-bg.png"
                        alt="Luxurious skincare cream jar"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-10 left-10 right-10 text-white">
                        <h2 className="text-4xl font-serif mb-3 leading-tight">Join The<br />Collective</h2>
                        <p className="font-sans text-sm opacity-90 max-w-sm leading-relaxed">Begin your journey to flawless, radiant skin with our expertly crafted formulations.</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <h1 className="text-4xl font-serif text-rich-black mb-3">Create Account</h1>
                        <p className="text-gray-500 font-sans text-sm">Sign up to start shopping premium skincare.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-rich-black mb-2" htmlFor="name">Full Name</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User size={18} />
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Jane Doe"
                                    autoComplete="name"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-pink-soft/20 font-sans"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

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
                            <label className="block text-sm font-medium text-rich-black mb-2" htmlFor="password">Password</label>
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
                                    autoComplete="new-password"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-pink-soft/20 font-sans"
                                    required
                                    minLength={8}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gold hover:bg-gold-dark text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Sign Up
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
                        Already have an account?{' '}
                        <Link href="/login" className="text-gold font-medium hover:underline transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
