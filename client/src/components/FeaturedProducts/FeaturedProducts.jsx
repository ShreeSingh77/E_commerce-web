import ProductCard from "../ProductCard/ProductCard";
import "./FeaturedProducts.css";
import headphones from "../../assets/products/headphones.jpg";
import shoes from "../../assets/products/shoes.jpg";
import smartwatch from "../../assets/products/smartwatch.jpg";
import backpack from "../../assets/products/backpack.jpg";

const products = [
  {
    id:1,
    name:"Wireless Headphones",
    category:"Electronics",
    price:2499,
    image:headphones,
  },
  {
    id:2,
    name:"Running Shoes",
    category:"Fashion",
    price:1899,
    image:shoes
  },
  {
    id:3,
    name:"Smart Watch",
    category:"Electronics",
    price:3999,
    image:smartwatch
  },
  {
    id:4,
    name:"Backpack",
    category:"Accessories",
    price:1499,
    image:backpack
  }
];

const FeaturedProducts = () => {
  return (
    <section className="featured-products">
      <h2>Featured Products</h2>

      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;