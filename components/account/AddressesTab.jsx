'use client';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddressesAsync, deleteAddressAsync } from "@/lib/features/address/addressSlice";
import { Plus, MapPin, Edit2, Trash2 } from "lucide-react";
import AddressModal from "@/components/AddressModal";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export default function AddressesTab() {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { list: addresses, status } = useSelector(state => state.address);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    useEffect(() => {
        if (status === 'idle' && session?.user?.id) {
            dispatch(fetchAddressesAsync(session.user.id));
        }
    }, [status, dispatch, session]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                await dispatch(deleteAddressAsync({ id, userId: session?.user?.id })).unwrap();
                toast.success("Address deleted successfully");
            } catch (error) {
                toast.error(error || "Failed to delete address");
            }
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setShowAddressModal(true);
    };

    const handleCloseModal = () => {
        setShowAddressModal(false);
        setTimeout(() => setEditingAddress(null), 200); // Clear after animation
    };

    if (status === 'loading') return <div className="py-20 flex justify-center"><Loading /></div>;

    return (
        <div className="w-full">
            <div className="flex justify-between flex-wrap gap-4 items-center mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Your addresses</h2>
                <button
                    onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#D4A398] hover:bg-[#c29186] text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} />
                    Add New Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <MapPin size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">No addresses found</h3>
                    <p className="text-gray-500 text-sm">Add a residential or delivery address to speed up checkout.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-xl p-5 bg-white relative group">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900">{address.name}</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(address)} className="text-gray-400 hover:text-[#D4A398] transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(address.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1">
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} {address.zip}</p>
                                <p>{address.country}</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 text-sm text-gray-600">
                                <p>Phone: {address.phone}</p>
                                <p>Email: {address.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddressModal && <AddressModal setShowAddressModal={handleCloseModal} initialData={editingAddress} />}
        </div>
    );
}
