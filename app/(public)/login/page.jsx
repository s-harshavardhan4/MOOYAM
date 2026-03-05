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
    const [step, setStep] = useState('credentials'); // 'credentials' or 'otp'
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', otp: '' });

    // Timer effect for OTP
    useEffect(() => {
        let timer;
        if (step === 'otp' && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0 && step === 'otp') {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [step, Math.floor(countdown)]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const requestOtp = async () => {
        setIsLoading(true);
        try {
            // First check if user is admin (bypass OTP for admin for simplicity)
            if (formData.email === 'admin@mooyan.com' && formData.password === 'admin@123') {
                const result = await signIn('credentials', {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                    otp: 'admin-bypass' // Doesn't matter, we hardcode admin bypass in authorize
                });

                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success('Signed in successfully');
                    router.push('/admin');
                    router.refresh();
                }
                return;
            }


            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || 'Failed to send OTP');
                return;
            }

            toast.success('Verification code sent to your email');
            setStep('otp');
            setCountdown(300); // Reset timer to 5 minutes
            setCanResend(false);
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = () => {
        requestOtp();
    }

    const handleSubmitCredentials = async (e) => {
        e.preventDefault();
        await requestOtp();
    };

    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // If the timer is 0, they cannot submit.
        if (countdown === 0) {
            toast.error('OTP has expired. Please resend.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
                otp: formData.otp
            });

            if (result?.error) {
                toast.error(result.error);
                // If it says expired, force them back to requesting state
                if (result.error.toLowerCase().includes('expired')) {
                    setCountdown(0);
                }
            } else {
                toast.success('Signed in successfully');
                router.push('/');
                router.refresh();
            }
        } catch (error) {
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
                        {step === 'credentials' ? (
                            <>
                                <h1 className="text-4xl font-serif text-rich-black mb-3">Welcome Back</h1>
                                <p className="text-gray-500 font-sans text-sm">Please enter your details to access your account.</p>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setStep('credentials')} className="text-gray-400 hover:text-rich-black transition-colors mb-4 flex items-center text-sm">
                                    &larr; Back to Login
                                </button>
                                <h1 className="text-4xl font-serif text-rich-black mb-3">Verification</h1>
                                <p className="text-gray-500 font-sans text-sm">We've sent a 6-digit code to <span className="font-medium text-rich-black">{formData.email}</span>.</p>
                            </>
                        )}
                    </div>

                    {step === 'credentials' ? (
                        <form className="space-y-6" onSubmit={handleSubmitCredentials}>
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
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmitOtp}>
                            <div>
                                <label className="block text-sm font-medium text-rich-black mb-2" htmlFor="otp">6-Digit Code</label>
                                <div className="relative flex flex-col items-center">
                                    <input
                                        type="text"
                                        id="otp"
                                        value={formData.otp || ''}
                                        onChange={(e) => {
                                            // Only allow numbers and limit to 6
                                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                            handleChange({ target: { id: 'otp', value: val } })
                                        }}
                                        placeholder="000000"
                                        className="w-full pl-6 pr-4 py-4 text-center tracking-[0.5em] text-2xl border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-pink-soft/20 font-sans"
                                        required
                                        maxLength={6}
                                        disabled={isLoading || countdown === 0}
                                    />
                                    <div className="mt-4 flex flex-col items-center">
                                        <p className={`text-sm font-medium ${countdown === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {countdown > 0 ? `Code expires in: ${formatTime(countdown)}` : 'Code has expired.'}
                                        </p>

                                        {canResend && (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={isLoading}
                                                className="mt-2 text-sm text-gold font-medium hover:underline focus:outline-none"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || countdown === 0 || !formData.otp || formData.otp.length < 6}
                                className="w-full bg-gold hover:bg-gold-dark text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-8 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify & Sign In
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {step === 'credentials' && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
