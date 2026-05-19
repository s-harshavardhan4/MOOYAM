'use client'
import { XIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addAddressAsync, updateAddressAsync } from "@/lib/features/address/addressSlice"
import { useSession } from "next-auth/react"

const AddressModal = ({ setShowAddressModal, initialData = null }) => {

    const dispatch = useDispatch();
    const { data: session } = useSession();

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    })

    useEffect(() => {
        if (initialData) {
            setAddress(initialData);
        }
    }, [initialData]);

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!session?.user?.id) {
            toast.error("Please login to manage addresses");
            return;
        }

        if (initialData) {
            await dispatch(updateAddressAsync({ 
                id: initialData.id, 
                addressData: address, 
                userId: session.user.id 
            })).unwrap();
        } else {
            await dispatch(addAddressAsync({ 
                addressData: address, 
                userId: session.user.id 
            })).unwrap();
        }
        
        setShowAddressModal(false)
    }

    return (
        <form onSubmit={e => toast.promise(handleSubmit(e), { loading: initialData ? 'Updating Address...' : 'Adding Address...' })} className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center">
            <div className="flex flex-col gap-5 text-slate-700 w-full max-w-sm mx-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 relative">
                <h2 className="text-2xl font-serif text-gray-900 mb-2">{initialData ? 'Edit' : 'Add New'} <span className="text-[#D4A398]">Address</span></h2>
                <input name="name" onChange={handleAddressChange} value={address.name} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm focus:border-[#D4A398] transition-colors" type="text" placeholder="Enter your name" required />
                <input name="email" onChange={handleAddressChange} value={address.email} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm focus:border-[#D4A398] transition-colors" type="email" placeholder="Email address" required />
                <input name="street" onChange={handleAddressChange} value={address.street} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm focus:border-[#D4A398] transition-colors" type="text" placeholder="Street" required />
                <div className="flex gap-4">
                    <input name="city" onChange={handleAddressChange} value={address.city} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm focus:border-[#D4A398] transition-colors" type="text" placeholder="City" required />
                    <input name="state" onChange={handleAddressChange} value={address.state} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm focus:border-[#D4A398] transition-colors" type="text" placeholder="State" required />
                </div>
                <div className="flex gap-4">
                    <input name="zip" onChange={handleAddressChange} value={address.zip} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm focus:border-[#D4A398] transition-colors" type="text" placeholder="Zip code" required />
                    <input name="country" onChange={handleAddressChange} value={address.country} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm focus:border-[#D4A398] transition-colors" type="text" placeholder="Country" required />
                </div>
                <input name="phone" onChange={handleAddressChange} value={address.phone} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm focus:border-[#D4A398] transition-colors" type="text" placeholder="Phone" required />
                <button className="bg-[#2C2C2C] text-white text-sm font-medium py-3 rounded-lg hover:bg-black active:scale-95 transition-all mt-2 uppercase tracking-wide">
                    {initialData ? 'Update Address' : 'Save Address'}
                </button>
            <XIcon size={24} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors" onClick={() => setShowAddressModal(false)} />
            </div>
        </form>
    )
}

export default AddressModal