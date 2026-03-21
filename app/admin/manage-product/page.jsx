'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"

export default function AdminManageProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products')
            const data = await res.json()
            if (data.success) {
                setProducts(data.products)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const updateProduct = async (id, updates) => {
        try {
            const res = await fetch('/api/products', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates })
            })
            const data = await res.json()
            if (!data.success) throw new Error(data.message)
            return true
        } catch (error) {
            console.error('Failed to update product', error)
            return false
        }
    }

    const handleToggleStock = async (id, currentStock) => {
        const promise = updateProduct(id, { inStock: !currentStock })
        toast.promise(promise, {
            loading: "Updating visibility...",
            success: "Visibility updated!",
            error: "Failed to update."
        })
        const success = await promise
        if (success) {
            setProducts(products.map(p => p.id === id ? { ...p, inStock: !currentStock } : p))
        }
    }

    const handleQuantityChange = async (id, currentQuantity, change) => {
        const newQuantity = Math.max(0, currentQuantity + change)
        if (newQuantity === currentQuantity) return;

        const success = await updateProduct(id, { quantity: newQuantity })
        if (success) {
            setProducts(products.map(p => p.id === id ? { ...p, quantity: newQuantity } : p))
            toast.success("Quantity updated")
        } else {
            toast.error("Failed to update quantity")
        }
    }

    const handlePriceChange = async (id, field, value) => {
        const numValue = parseFloat(value)
        if (isNaN(numValue)) return;

        const success = await updateProduct(id, { [field]: numValue })
        if (success) {
            setProducts(products.map(p => p.id === id ? { ...p, [field]: numValue } : p))
            toast.success(`${field.toUpperCase()} updated`)
        } else {
            toast.error(`Failed to update ${field}`)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>
            <div className="overflow-x-auto">
                <table className="w-full text-left ring ring-slate-200 rounded overflow-hidden text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Quantity</th>
                            <th className="px-4 py-3">Visible</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {products.map((product) => (
                            <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex gap-3 items-center">
                                        <Image width={40} height={40} className='p-1 shadow rounded' src={product.images[0] || '/products/MOOYAM.jpeg'} alt="" />
                                        <span className="truncate max-w-[200px] block" title={product.name}>{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <div className="flex items-center gap-1">
                                        <span>{currency}</span>
                                        <input
                                            type="number"
                                            defaultValue={product.mrp}
                                            onBlur={(e) => {
                                                if (e.target.value != product.mrp) {
                                                    handlePriceChange(product.id, 'mrp', e.target.value)
                                                }
                                            }}
                                            className="w-20 border border-gray-300 rounded-md text-sm p-1"
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <span>{currency}</span>
                                        <input
                                            type="number"
                                            defaultValue={product.price}
                                            onBlur={(e) => {
                                                if (e.target.value != product.price) {
                                                    handlePriceChange(product.id, 'price', e.target.value)
                                                }
                                            }}
                                            className="w-20 border border-gray-300 rounded-md text-sm p-1 font-medium"
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleQuantityChange(product.id, product.quantity || 0, -1)} className="bg-slate-200 hover:bg-slate-300 w-6 h-6 rounded flex items-center justify-center font-bold">-</button>
                                        <span className="w-8 text-center">{product.quantity || 0}</span>
                                        <button onClick={() => handleQuantityChange(product.id, product.quantity || 0, 1)} className="bg-slate-200 hover:bg-slate-300 w-6 h-6 rounded flex items-center justify-center font-bold">+</button>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                        <input type="checkbox" className="sr-only peer" onChange={() => handleToggleStock(product.id, product.inStock)} checked={product.inStock} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}