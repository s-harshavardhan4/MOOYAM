'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTransactions = async () => {
        try {
            const res = await fetch('/api/admin/transactions')
            const data = await res.json()
            if (data.success) {
                setTransactions(data.transactions)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Admin <span className="text-slate-800 font-medium">Transactions</span></h1>
            {transactions.length === 0 ? (
                <p>No online transactions found.</p>
            ) : (
                <div className="overflow-x-auto max-w-5xl rounded-md shadow border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                            <tr>
                                {["Sr. No.", "Transaction ID", "Customer", "Amount", "Method", "Payment Status", "Date"].map((heading, i) => (
                                    <th key={i} className="px-4 py-3">{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((txn, index) => (
                                <tr key={txn.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="pl-6 text-green-600">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{txn.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-700">{txn.customerName}</span>
                                            <span className="text-xs text-slate-400">{txn.customerEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-800">₹{txn.total}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded border border-indigo-100">
                                            {txn.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {txn.isPaid ? (
                                            <span className="text-green-600 font-medium flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Successful
                                            </span>
                                        ) : (
                                            <span className="text-amber-600 font-medium flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending / Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(txn.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
