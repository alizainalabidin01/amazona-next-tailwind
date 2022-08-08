import React from 'react';
import Link from 'next/link';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <div className=" justify-self-center h-52 ">
        <Link href={`/product/${product._id}`}>
          <a>
            <img
              src={product.images}
              alt={product.name}
              className="rounded shadow h-full"
            ></img>
          </a>
        </Link>
      </div>
      <div className="flex flex-col font-semibold items-center justify-center ">
        <Link href={`/product/${product._id}`}>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
