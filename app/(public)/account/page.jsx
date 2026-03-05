'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, MapPin, Shield, CreditCard, Heart, HeadphonesIcon, LogOut } from 'lucide-react';
import OrdersTab from '@/components/account/OrdersTab';
import AddressesTab from '@/components/account/AddressesTab';
import SecurityTab from '@/components/account/SecurityTab';
import SavedTab from '@/components/account/SavedTab';

function AccountContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabQuery = searchParams.get('tab');

    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        if (tabQuery) {
            setActiveTab(tabQuery);
        }
    }, [tabQuery]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    if (!session) return null;

    const sidebarItems = [
        { id: 'orders', label: 'My orders', icon: <Package size={18} /> },
        { id: 'addresses', label: 'Your addresses', icon: <MapPin size={18} /> },
        { id: 'security', label: 'Login & security', icon: <Shield size={18} /> },
        { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
        { id: 'saved', label: 'Saved items', icon: <Heart size={18} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <OrdersTab />;
            case 'addresses':
                return <AddressesTab />;
            case 'security':
                return <SecurityTab />;
            case 'payments':
                return <div className="text-gray-500">Payments functionality coming soon.</div>;
            case 'saved':
                return <SavedTab />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F3F1] py-8 lg:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Information */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold text-[#2C2C2C] mb-2">Your Account</h1>
                    <p className="text-gray-500 text-sm">
                        {session.user?.name}, Email: {session.user?.email}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <nav className="flex flex-col gap-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        router.push(`/account?tab=${item.id}`);
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === item.id
                                        ? 'bg-white text-[#D4A398] shadow-sm shadow-[#D4A398]/10 disabled'
                                        : 'text-gray-600 hover:bg-white/60 hover:text-[#D4A398]'
                                        }`}
                                >
                                    <span className={`${activeTab === item.id ? 'text-[#D4A398]' : 'text-gray-400'}`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </button>
                            ))}

                            <hr className="my-2 border-gray-200" />

                            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-white/60 hover:text-[#D4A398] transition-colors text-left">
                                <span className="text-gray-400"><HeadphonesIcon size={18} /></span>
                                Customer support
                            </button>

                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors text-left"
                            >
                                <span className="text-gray-400 group-hover:text-red-500"><LogOut size={18} /></span>
                                Log out
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 lg:p-10 min-h-[500px]">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AccountPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
            <AccountContent />
        </Suspense>
    );
}
