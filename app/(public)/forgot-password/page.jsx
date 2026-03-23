'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
 
            const data = await res.json();
 
            if (!res.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }
 
            if (data.devOtp) {
                // Remove dev-only toast to match production behavior as requested
                toast.success('OTP sent to your email');
            } else {
                toast.success('OTP sent to your email');
            }
            setStep(2);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (formData.newPassword !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (formData.newPassword.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // 1. Verify OTP first
            const verifyRes = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp
                })
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
                throw new Error(verifyData.message || 'Invalid OTP');
            }

            // 2. Reset Password
            const resetRes = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp,
                    newPassword: formData.newPassword
                })
            });

            const resetData = await resetRes.json();

            if (!resetRes.ok) {
                throw new Error(resetData.message || 'Failed to reset password');
            }

            toast.success('Password reset successfully');
            router.push('/login');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-soft flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="md:w-full p-8 md:p-12 flex flex-col justify-center bg-white">
                    <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-gray-500 hover:text-[#D4A398] transition-colors">
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-serif text-rich-black mb-3">
                            {step === 1 ? 'Reset Password' : 'Enter OTP'}
                        </h1>
                        <p className="text-gray-500 font-sans text-sm">
                            {step === 1
                                ? 'Enter your email to receive a reset code.'
                                : 'Enter the OTP sent to your email.'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form className="space-y-6" onSubmit={handleSendOtp}>
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
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-pink-soft/20 font-sans"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gold hover:bg-gold-dark text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Code
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <div>
                                <label className="block text-sm font-medium text-rich-black mb-2" htmlFor="otp">OTP Code</label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-pink-soft/20 font-sans text-center text-xl tracking-widest"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-rich-black mb-2" htmlFor="newPassword">New Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="New password"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-pink-soft/20 font-sans"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-rich-black mb-2" htmlFor="confirmPassword">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all bg-pink-soft/20 font-sans"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gold hover:bg-gold-dark text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 hover:text-[#D4A398] transition-colors text-sm"
                            >
                                Resend OTP
                            </button>
                        </form>
                    )}

                    <p className="text-center mt-8 text-sm text-gray-600 font-sans">
                        Remember your password?{' '}
                        <Link href="/login" className="text-gold font-medium hover:underline transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
