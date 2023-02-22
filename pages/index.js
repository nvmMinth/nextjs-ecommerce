import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import Product from "../models/product";
import db from "../utils/db";

export default function Home({ products }) {
  return (
    <Layout title="Home">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard product={product} key={product.slug} />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: { products: products.map(db.covertDocToObj) },
  };
}
