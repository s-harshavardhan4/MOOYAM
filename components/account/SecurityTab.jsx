'use client';
import { useState, useEffect } from "react";
import { User, Lock, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import Loading from "@/components/Loading";

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user/profile');
                const data = await res.json();
                if (data.success) {
                    setUser(data.user);
                    setName(data.user.name);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast.error("Name cannot be empty");

        setUpdatingName(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Profile updated successfully");
                update({ name: data.user.name }); // Update NextAuth session
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setUpdatingName(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match");
        }
        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setUpdatingPassword(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Password updated successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(data.message || "Failed to update password");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) return;

        setDeletingAccount(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Account deleted");
                signOut({ callbackUrl: '/' });
            } else {
                toast.error(data.message || "Failed to delete account");
                setDeletingAccount(false);
            }
        } catch (error) {
            toast.error("An error occurred");
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
                    Change Password
                </h3>
                <form onSubmit={handleUpdatePassword} className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full md:w-2/3 p-2.5 outline-none border border-gray-200 rounded-lg focus:border-[#D4A398] transition-all"
                            required
                        />
                    </div>
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
                    <button
                        type="submit"
                        disabled={updatingPassword || !currentPassword || !newPassword || !confirmPassword}
                        className="mt-2 w-fit px-6 py-2 bg-[#2C2C2C] hover:bg-black text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {updatingPassword && <Loader2 size={16} className="animate-spin" />}
                        Update Password
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
