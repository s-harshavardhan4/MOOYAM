'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { useSession } from 'next-auth/react'
import { makeStore } from '../lib/store'
import { setProduct } from '@/lib/features/product/productSlice'
import { fetchWishlistAsync } from '@/lib/features/wishlist/wishlistSlice'
import { fetchFromApi } from '@/lib/api-client'

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  const { data: session } = useSession()
  
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    fetchFromApi('/api/products')
      .then(data => {
        if (data.success) {
          storeRef.current.dispatch(setProduct(data.products))
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (session?.user?.id) {
      storeRef.current.dispatch(fetchWishlistAsync(session.user.id))
    }
  }, [session])

  return <Provider store={storeRef.current}>{children}</Provider>
}
