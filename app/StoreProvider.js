'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
import { setProduct } from '@/lib/features/product/productSlice'
import { fetchWishlistAsync } from '@/lib/features/wishlist/wishlistSlice'

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          storeRef.current.dispatch(setProduct(data.products))
        }
      })
      .catch(console.error)

    storeRef.current.dispatch(fetchWishlistAsync())
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}