'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { signIn, useSession, getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // If already logged in, redirect — admin goes to /admin, users go to callbackUrl
    useEffect(() => {
        if (status === 'authenticated') {
            if (session?.user?.isAdmin) {
                router.push('/admin');
            } else {
                router.push(callbackUrl);
            }
        }
    }, [status, session, router, callbackUrl]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (res?.error) {
                toast.error(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error);
                return;
            }

            toast.success('Successfully signed in!');
            // Get the fresh session immediately to check isAdmin
            const updatedSession = await getSession();
            if (updatedSession?.user?.isAdmin) {
                router.push('/admin');
            } else {
                router.push(callbackUrl);
            }

        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider) => {
        try {
            await signIn(provider, { callbackUrl });
        } catch (error) {
            toast.error(`${provider} sign in failed`);
        }
    };

    return (
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-rich-black mb-3">Sign In</h1>
                <p className="text-gray-500 font-sans text-sm">Enter your credentials to access your account.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-rich-black" htmlFor="password">Password</label>
                        <Link href="/forgot-password" display="inline-block" className="text-xs text-gold hover:underline font-sans">
                            Forgot Password?
                        </Link>
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
                    className="w-full bg-gold hover:bg-gold-dark text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
                <span className="text-xs text-gray-400 font-sans uppercase tracking-wider">Or continue with</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>

            <div className="mt-6 space-y-3">
                <button
                    onClick={() => handleOAuthSignIn('google')}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-all group cursor-pointer"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>

                <button
                    onClick={() => handleOAuthSignIn('github')}
                    className="w-full bg-gray-900 border border-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-3 transition-all group cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    Continue with GitHub
                </button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-4">
                <div className="h-[1px] bg-gray-200 flex-1"></div>
                <span className="text-xs text-gray-400 font-sans uppercase tracking-wider">Or</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>

            <p className="text-center mt-8 text-sm text-gray-600 font-sans">
                Don't have an account?{' '}
                <Link href="/signup" className="text-gold font-medium hover:underline transition-all">
                    Create Account
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-pink-soft flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Image Section - Left Side For Login */}
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
                        <h2 className="text-4xl font-serif mb-3 leading-tight">Welcome<br />Back</h2>
                        <p className="font-sans text-sm opacity-90 max-w-sm leading-relaxed">Continue your daily ritual with our premium skincare collections.</p>
                    </div>
                </div>

                {/* Form Section Wrapped in Suspense */}
                <Suspense fallback={<div className="md:w-1/2 p-8 flex items-center justify-center"><Loader2 className="animate-spin text-gold" /></div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
