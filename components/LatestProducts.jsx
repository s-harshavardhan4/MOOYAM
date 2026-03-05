'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const LatestProducts = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list).filter(p => p.inStock)

    return (
        <div className='px-6 my-16 max-w-6xl mx-auto'>
            <Title title='Latest Products' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10 xl:gap-8 mx-auto'>
                {(() => {
                    const sortedProducts = products.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    const snailCreamIndex = sortedProducts.findIndex(p => p.name === "Snail 92 All In One Cream");

                    let displayList = [];

                    if (snailCreamIndex !== -1) {
                        const snailCream = sortedProducts[snailCreamIndex];
                        // Remove it from the general list
                        const others = sortedProducts.filter((_, i) => i !== snailCreamIndex);

                        // First 4 standard products for Row 1
                        displayList = [...others.slice(0, 4)];

                        // Insert Snail 92 at position 4 (Row 2, pos 1)
                        displayList.push(snailCream);

                        // Fill the rest up to the displayQuantity
                        displayList = [...displayList, ...others.slice(4)].slice(0, displayQuantity);
                    } else {
                        displayList = sortedProducts.slice(0, displayQuantity);
                    }

                    return displayList;
                })().map((product, index) => {
                    const isSnailCream = product.name === "Snail 92 All In One Cream";

                    return (
                        <ProductCard
                            key={product.id || index}
                            product={product}
                            className={isSnailCream ? "col-span-2 md:col-span-2 lg:col-span-2" : "col-span-1"}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default LatestProducts