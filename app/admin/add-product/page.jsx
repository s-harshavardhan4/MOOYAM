'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { PlusIcon, XIcon } from "lucide-react"
export default function AdminAddProduct() {

    const products = useSelector(state => state.product.list) || []

    const defaultCategories = ['SkinCare', 'HairCare', 'Makeup']
    const dbCategories = products.map(p => p.category).filter(Boolean)
    const categories = Array.from(new Set([...defaultCategories, ...dbCategories]))

    const defaultSubCategories = ['Creams', 'Serums']
    const dbSubCategories = products.map(p => p.subCategory).filter(Boolean)
    const subCategories = Array.from(new Set([...defaultSubCategories, ...dbSubCategories]))

    const [isNewCategory, setIsNewCategory] = useState(false)
    const [isNewSubCategory, setIsNewSubCategory] = useState(false)

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
        subCategory: "",
    })
    const [loading, setLoading] = useState(false)


    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Note: Since we are not using Cloudinary/S3 yet, we will just send dummy image paths
            // for the uploaded images so the database insert succeeds without breaking.
            const dummyImages = [
                '/products/MOOYAM.jpeg',
                '/products/acne_serum(1).jpeg'
            ]

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: productInfo.name,
                    description: productInfo.description,
                    mrp: parseFloat(productInfo.mrp),
                    price: parseFloat(productInfo.price),
                    category: productInfo.category,
                    subCategory: productInfo.subCategory || undefined,
                    images: dummyImages
                })
            })

            const data = await response.json()

            if (response.ok) {
                // Reset form on success
                setProductInfo({ name: "", description: "", mrp: 0, price: 0, category: "", subCategory: "" })
                setImages({ 1: null, 2: null, 3: null, 4: null })
                return Promise.resolve(data)
            } else {
                throw new Error(data.message || 'Error adding product')
            }

        } catch (error) {
            console.error('Submit Error:', error)
            return Promise.reject(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product...", success: "Product added successfully!", error: "Failed to add product" })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div htmlFor="" className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Actual Price (₹)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price (₹)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
            </div>

            <div className="flex gap-5 mb-6">
                {/* Category Selection/Creation */}
                <div className="w-full max-w-sm">
                    <label className="text-sm mb-2 block">Category</label>
                    <div className="flex items-center gap-2">
                        {!isNewCategory ? (
                            <>
                                <select onChange={onChangeHandler} name="category" value={productInfo.category} className="w-full p-2 px-4 outline-none border border-slate-200 rounded" required>
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={() => { setIsNewCategory(true); setProductInfo({ ...productInfo, category: "" }) }} className="p-2 border border-slate-200 rounded hover:bg-slate-50 transition-all text-slate-500" title="Add New Category">
                                    <PlusIcon size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <input type="text" name="category" onChange={onChangeHandler} value={productInfo.category} placeholder="Enter new category" className="w-full p-2 px-4 outline-none border border-slate-200 rounded" required />
                                <button type="button" onClick={() => { setIsNewCategory(false); setProductInfo({ ...productInfo, category: "" }) }} className="p-2 border border-transparent rounded hover:bg-red-50 transition-all text-red-500" title="Cancel">
                                    <XIcon size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* SubCategory Selection/Creation */}
                <div className="w-full max-w-sm">
                    <label className="text-sm mb-2 block">SubCategory (Optional)</label>
                    <div className="flex items-center gap-2">
                        {!isNewSubCategory ? (
                            <>
                                <select onChange={onChangeHandler} name="subCategory" value={productInfo.subCategory} className="w-full p-2 px-4 outline-none border border-slate-200 rounded">
                                    <option value="">Select a sub-category</option>
                                    {subCategories.map((subCategory) => (
                                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={() => { setIsNewSubCategory(true); setProductInfo({ ...productInfo, subCategory: "" }) }} className="p-2 border border-slate-200 rounded hover:bg-slate-50 transition-all text-slate-500" title="Add New SubCategory">
                                    <PlusIcon size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <input type="text" name="subCategory" onChange={onChangeHandler} value={productInfo.subCategory} placeholder="Enter new sub-category" className="w-full p-2 px-4 outline-none border border-slate-200 rounded" />
                                <button type="button" onClick={() => { setIsNewSubCategory(false); setProductInfo({ ...productInfo, subCategory: "" }) }} className="p-2 border border-transparent rounded hover:bg-red-50 transition-all text-red-500" title="Cancel">
                                    <XIcon size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <br />

            <button disabled={loading} className="bg-[#D4A398] text-white px-6 mt-7 py-2 hover:bg-[#C49792] shadow-sm rounded transition-all">Add Product</button>
        </form>
    )
}