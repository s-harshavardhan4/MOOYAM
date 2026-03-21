'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { useSession } from 'next-auth/react'
import { makeStore } from '../lib/store'
import { setProduct } from '@/lib/features/product/productSlice'
import { fetchWishlistAsync } from '@/lib/features/wishlist/wishlistSlice'

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  const { data: session } = useSession()
  
  if (!storeRef.current) {
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
  }, [])

  useEffect(() => {
    if (session?.user) {
      storeRef.current.dispatch(fetchWishlistAsync())
    }
  }, [session])

  return <Provider store={storeRef.current}>{children}</Provider>
}
