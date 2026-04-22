'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { productDummyData } from "@/assets/assets";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { clearCart } from "@/lib/features/cart/cartSlice";
import toast from "react-hot-toast";

import { fetchFromApi } from "@/lib/api-client";
import { useSession } from "next-auth/react";

export default function Orders() {
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const success = searchParams.get('success');

    const globalProducts = useSelector(state => state.product.list)

    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        if (!session?.user?.id) return;
        try {
            const data = await fetchFromApi(`/api/orders?userId=${session.user.id}`)

            if (data.success) {
                // Map the static product info from assets.js onto the fetched orderItems
                const populatedOrders = data.orders.map(order => {
                    const mappedItems = order.orderItems.map(item => {
                        const productInfo = globalProducts.find(p => p.id === item.productId) || productDummyData.find(p => p.id === item.productId)
                        return {
                            ...item,
                            product: productInfo || { name: 'Unknown Product', images: ['/placeholder.png'] }
                        }
                    })
                    return { ...order, orderItems: mappedItems }
                })
                setOrders(populatedOrders)
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    }

    useEffect(() => {
        if (session?.user?.id) {
            fetchOrders()
        }
        if (success === 'true') {
            dispatch(clearCart());
            toast.success("Your order has been placed!");
            router.replace('/orders');
        }
    }, [success, dispatch, session, router]);

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                (
                    <div className="my-20 max-w-7xl mx-auto">
                        <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

                        <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                            <thead>
                                <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                    <th className="text-left">Product</th>
                                    <th className="text-center">Total Price</th>
                                    <th className="text-left">Address</th>
                                    <th className="text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <OrderItem order={order} key={order.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">You have no orders</h1>
                </div>
            )}
        </div>
    )
}