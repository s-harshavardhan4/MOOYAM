'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, MoreVertical, Package } from "lucide-react";
import { useSelector } from "react-redux";
import { productDummyData } from "@/assets/assets";
import Loading from "@/components/Loading";
import { fetchFromApi } from "@/lib/api-client";
import { useSession } from "next-auth/react";

export default function OrdersTab() {
    const { data: session } = useSession();
    const globalProducts = useSelector(state => state.product.list);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'paid', 'unpaid', 'all'

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

    const fetchOrders = async () => {
        if (!session?.user?.id) return;
        try {
            const data = await fetchFromApi(`/api/orders?userId=${session.user.id}`);
            
            if (data.success) {
                const populatedOrders = data.orders.map(order => {
                    const mappedItems = order.orderItems.map(item => {
                        const productInfo = globalProducts.find(p => p.id === item.productId) || productDummyData.find(p => p.id === item.productId);
                        return {
                            ...item,
                            product: productInfo || { name: 'Unknown Product', images: ['/placeholder.png'] }
                        };
                    });
                    return { ...order, orderItems: mappedItems };
                });
                setOrders(populatedOrders);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            fetchOrders();
        }
    }, [session]);

    const formatDate = (dateString) => {
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const formatTimeDateInfo = (dateString) => {
        const date = new Date(dateString);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    if (loading) return <div className="py-20 flex justify-center"><Loading /></div>;

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Package size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">No orders yet</h3>
                <p className="text-gray-500 text-sm">When you place an order, it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header Tabs (Static for now to match UI) */}
            <div className="flex gap-2 mb-8 border-b border-gray-100 pb-4">
                <button
                    onClick={() => setFilter('paid')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'paid' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Paid
                </button>
                <button
                    onClick={() => setFilter('unpaid')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unpaid' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Unpaid
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    All orders
                </button>
            </div>

            {/* Orders List */}
            <div className="flex flex-col gap-6">
                {orders.filter(order => {
                    if (filter === 'paid') return order.isPaid === true;
                    if (filter === 'unpaid') return order.isPaid === false;
                    return true; // 'all'
                }).map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden">

                        {/* Order Header */}
                        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-0.5">Order #: {order.id.slice(-6).toUpperCase()}</h3>
                                <p className="text-xs text-gray-500">
                                    {order.orderItems.length} Products | By {order.address?.name || 'Customer'} | {formatTimeDateInfo(order.createdAt)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Download size={16} />
                                    Download invoice
                                </button>
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Order Details & Items */}
                        <div className="p-5">
                            {/* Order Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Status:</p>
                                    <p className={`font-medium ${order.status === 'ORDER_PLACED' ? 'text-amber-500' :
                                        order.status === 'PROCESSING' ? 'text-blue-500' :
                                            order.status === 'SHIPPED' ? 'text-[#D4A398]' :
                                                'text-green-500'
                                        }`}>
                                        {/* Matches reference styling for "On the way" vs "Shipped to customer" */}
                                        {order.status === 'SHIPPED' ? 'On the way' : order.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Date of delivery:</p>
                                    <p className="font-medium text-gray-900">
                                        {/* Dummy estimation 5 days after creation */}
                                        {formatDate(new Date(order.createdAt).getTime() + (5 * 24 * 60 * 60 * 1000))}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-gray-500 mb-1">Delivered to:</p>
                                    <p className="font-medium text-gray-900 truncate">
                                        {order.address ? `${order.address.street || ''}, ${order.address.city || ''} ${order.address.state || ''}, ${order.address.zip || ''}` : 'Address not available'}
                                    </p>
                                </div>
                                <div className="lg:col-span-4 mt-2 flex flex-col sm:flex-row gap-4 sm:gap-12">
                                    <div>
                                        <p className="text-gray-500 inline-block w-24">Total:</p>
                                        <p className="font-bold text-gray-900 inline-block">{currency} {order.total.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 inline-block w-32">Payment:</p>
                                        <p className="font-medium text-gray-900 inline-block">{order.paymentMethod} {order.isPaid ? '(Paid)' : '(Unpaid)'}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-5" />

                            {/* Items Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                                            <Image
                                                src={item.product?.images?.[0] || '/placeholder.png'}
                                                alt={item.product.name}
                                                width={60}
                                                height={60}
                                                className="object-contain max-h-full"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{item.product.name}</p>
                                            <p className="text-xs text-gray-500 mb-0.5">Quantity: {item.quantity} × {currency} {item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
