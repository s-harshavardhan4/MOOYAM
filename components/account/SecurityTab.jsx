'use client';
import { useState, useEffect } from "react";
import { User, Lock, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import { fetchFromApi } from "@/lib/api-client";

// OTP & Auth routes live in Next.js — use plain fetch, not fetchFromApi (which targets Express)
async function callLocalApi(endpoint, body) {
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
}

export default function SecurityTab() {
    const { data: session, update } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states
    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Loading states
    const [updatingName, setUpdatingName] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    
    // OTP states for OAuth users
    const [showOtpField, setShowOtpField] = useState(false);
    const [otp, setOtp] = useState("");
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [isForgotMode, setIsForgotMode] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.user?.id) return;
            try {
                const data = await fetchFromApi(`/api/user/profile?userId=${session.user.id}`);
                setUser(data.user);
                setName(data.user.name);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [session]);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Name cannot be empty");

        setUpdatingName(true);
        try {
            const data = await fetchFromApi('/api/user/profile', {
                method: 'PUT',
                body: { name, userId: session.user.id }
            });

            toast.success("Profile updated successfully");
            update({ name: data.user.name }); // Update NextAuth session
        } catch (error) {
            toast.error(error.message || "An error occurred");
        } finally {
            setUpdatingName(false);
        }
    };

    const handleSendOtp = async () => {
        setSendingOtp(true);
        try {
            await callLocalApi('/api/auth/send-otp', { email: user.email });
            setOtpSent(true);
            setShowOtpField(true);
            toast.success("OTP sent to your email");
        } catch (error) {
            toast.error(error.message || "Error sending OTP");
        } finally {
            setSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) return toast.error("Please enter a 6-digit OTP");
        
        setVerifyingOtp(true);
        try {
            await callLocalApi('/api/auth/verify-otp', { email: user.email, otp });
            setIsOtpVerified(true);
            toast.success("Email verified! You can now set your password.");
        } catch (error) {
            toast.error(error.message || "Error verifying OTP");
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        
        // Validation
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match");
        }
        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        // If user has no password OR is in forgot mode, they MUST have a verified OTP
        if ((!user?.hasPassword || isForgotMode) && !isOtpVerified) {
            return toast.error("Please verify the OTP sent to your email first");
        }

        setUpdatingPassword(true);
        try {
            const isResetFlow = !user?.hasPassword || isForgotMode;
            if (isResetFlow) {
                // Use local Next.js route for password reset (uses OTP)
                await callLocalApi('/api/auth/reset-password', {
                    email: user.email,
                    otp,
                    newPassword
                });
            } else {
                // Use Express backend for password change (uses current password)
                await fetchFromApi('/api/user/profile', {
                    method: 'PATCH',
                    body: { currentPassword, newPassword, userId: session.user.id }
                });
            }

            toast.success(isResetFlow ? "Password reset successfully" : "Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setOtp("");
            setShowOtpField(false);
            setOtpSent(false);
            setIsOtpVerified(false);
            setIsForgotMode(false);
            
            // Refresh user state
            const refreshData = await fetchFromApi(`/api/user/profile?userId=${session.user.id}`);
            setUser(refreshData.user);

        } catch (error) {
            toast.error(error.message || "An error occurred");
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) return;

        setDeletingAccount(true);
        try {
            await fetchFromApi(`/api/user/profile?userId=${session.user.id}`, {
                method: 'DELETE'
            });
            toast.success("Account deleted");
            signOut({ callbackUrl: '/' });
        } catch (error) {
            toast.error(error.message || "An error occurred");
            setDeletingAccount(false);
        }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loading /></div>;

    return (
        <div className="w-full max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Login & Security</h2>

            {/* Personal Information */}
            <div className="mb-10">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                    <User size={18} className="text-[#D4A398]" />
                    Personal Information
                </h3>
                <form onSubmit={handleUpdateName} className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full md:w-2/3 p-2.5 outline-none border border-gray-200 rounded-lg focus:border-[#D4A398] focus:ring-1 focus:ring-[#D4A398] transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="w-full md:w-2/3 p-2.5 outline-none border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={updatingName || name === user?.name}
                        className="mt-2 w-fit px-6 py-2 bg-[#2C2C2C] hover:bg-black text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {updatingName && <Loader2 size={16} className="animate-spin" />}
                        Save Changes
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="mb-10">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                    <Lock size={18} className="text-[#D4A398]" />
                    {user?.hasPassword ? "Change Password" : "Set Account Password"}
                </h3>
                <form onSubmit={handleUpdatePassword} className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex flex-col gap-4">
                    {!user?.hasPassword ? (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-gray-600 mb-2">
                                You signed in with Google. To enable email/password login, please verify your email and set a password.
                            </p>
                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp}
                                    className="w-fit px-4 py-2 bg-[#D4A398] hover:bg-[#c99285] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    {sendingOtp && <Loader2 size={16} className="animate-spin" />}
                                    Send Verification OTP
                                </button>
                            ) : !isOtpVerified ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP sent to your email</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="6-digit code"
                                            className="w-full md:w-1/3 p-2.5 outline-none border border-gray-200 rounded-lg focus:border-[#D4A398] transition-all text-center tracking-widest font-bold"
                                            maxLength={6}
                                            required
                                        />
                                        <button 
                                            type="button" 
                                            onClick={handleVerifyOtp}
                                            disabled={verifyingOtp || otp.length !== 6}
                                            className="px-4 py-2.5 bg-[#2C2C2C] text-white rounded-lg text-xs font-medium hover:bg-black disabled:opacity-50 transition-all flex items-center gap-2"
                                        >
                                            {verifyingOtp && <Loader2 size={14} className="animate-spin" />}
                                            Verify OTP
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={handleSendOtp}
                                            className="text-xs text-gray-400 hover:text-[#D4A398] hover:underline"
                                        >
                                            Resend
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Email verified successfully. Please set your new password below.
                                </div>
                            )}
                        </div>
                    ) : isForgotMode ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Forgot your password? Please verify your email to set a new one.
                                </p>
                                <button 
                                    type="button" 
                                    onClick={() => { setIsForgotMode(false); setOtpSent(false); setIsOtpVerified(false); setOtp(""); }}
                                    className="text-xs text-gray-500 hover:text-[#D4A398] underline"
                                >
                                    Cancel
                                </button>
                            </div>
                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp}
                                    className="w-fit px-4 py-2 bg-[#D4A398] hover:bg-[#c99285] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    {sendingOtp && <Loader2 size={16} className="animate-spin" />}
                                    Send Reset OTP
                                </button>
                            ) : !isOtpVerified ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP sent to your email</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="6-digit code"
                                            className="w-full md:w-1/3 p-2.5 outline-none border border-gray-200 rounded-lg focus:border-[#D4A398] transition-all text-center tracking-widest font-bold"
                                            maxLength={6}
                                            required
                                        />
                                        <button 
                                            type="button" 
                                            onClick={handleVerifyOtp}
                                            disabled={verifyingOtp || otp.length !== 6}
                                            className="px-4 py-2.5 bg-[#2C2C2C] text-white rounded-lg text-xs font-medium hover:bg-black disabled:opacity-50 transition-all flex items-center gap-2"
                                        >
                                            {verifyingOtp && <Loader2 size={14} className="animate-spin" />}
                                            Verify OTP
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={handleSendOtp}
                                            className="text-xs text-gray-400 hover:text-[#D4A398] hover:underline"
                                        >
                                            Resend
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Email verified! Please set your new password below.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div className="md:w-2/3 flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <button 
                                    type="button" 
                                    onClick={() => { setIsForgotMode(true); handleSendOtp(); }}
                                    className="text-xs text-[#D4A398] hover:underline font-medium"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full md:w-2/3 p-2.5 outline-none border border-gray-200 rounded-lg focus:border-[#D4A398] transition-all"
                                required
                            />
                        </div>
                    )}
                    
                    {((user?.hasPassword && !isForgotMode) || isOtpVerified) && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full md:w-2/3 p-2.5 outline-none border border-gray-200 rounded-lg focus:border-[#D4A398] transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full md:w-2/3 p-2.5 outline-none border border-gray-200 rounded-lg focus:border-[#D4A398] transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </>
                    )}
                    
                    <button
                        type="submit"
                        disabled={updatingPassword || (!user?.hasPassword && !isOtpVerified) || (isForgotMode && !isOtpVerified) || (user?.hasPassword && !isForgotMode && !currentPassword) || !newPassword || !confirmPassword}
                        className="mt-2 w-fit px-6 py-2 bg-[#2C2C2C] hover:bg-black text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {updatingPassword && <Loader2 size={16} className="animate-spin" />}
                        {(user?.hasPassword && !isForgotMode) ? "Update Password" : "Set Password"}
                    </button>
                </form>
            </div>

            {/* Danger Zone */}
            <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-4">
                    <AlertTriangle size={18} />
                    Danger Zone
                </h3>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="font-medium text-red-900 mb-1">Delete Account</h4>
                        <p className="text-sm text-red-700 max-w-md">
                            Once you delete your account, there is no going back. All your addresses, orders history, and personal data will be permanently wiped.
                        </p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount || session?.user?.email === 'admin@mooyan.com'}
                        className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {deletingAccount ? <Loader2 size={16} className="animate-spin" /> : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    );
}
