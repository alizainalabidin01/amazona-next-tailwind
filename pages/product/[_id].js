// import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  // const router = useRouter();

  if (!product) {
    return <Layout title="Product not found">Product not found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      toast.error('Sorry. Product is out of stock');
    } else {
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
      toast.success('Product added to the cart');
    }

    // router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Back</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className=" md:col-span-2">
          <img
            src={product.images}
            alt={product.name}
            layout="responsive"
            className="w-full"
          ></img>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category : {product.category}</li>
            <li>Brand : {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description : {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card1 p-5">
            <div className="mb-2 flex justify-between">
              <div>Price :</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Stock :</div>
              <div>{product.countInStock > 0 ? 'In Stock' : 'Unvailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { _id } = params;
  await db.connect();
  const product = await Product.findById({ _id }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
