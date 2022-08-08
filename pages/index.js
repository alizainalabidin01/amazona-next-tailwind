import { useContext } from 'react';
import Layout from '../components/layout.js';
import ProductItem from '../components/productItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
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
    <Layout title="Home Page">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  xs:grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product._id}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
