import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import "./Products.css";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import {useNavigate } from "react-router-dom"
import { addToCart } from "../services/cartServices.js";
import toast from "react-hot-toast";
import { addToWishlist } from "../services/wishlistService.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const Products = () => {
  const navigate = useNavigate();
 const [search, setSearch] = useState("");
const [sort, setSort] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {fetchWishlist }=useWishlist();
  const {fetchCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
    const response = await getAllProducts();
   console.log(response);
   console.log(products);
   console.log(Array.isArray(products));
   console.log("Products",response.data.products);
   
   
setProducts(response.data.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading Products...</h2>;
  }
 
  const filteredProducts = [...products]
  .filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    return 0;
  });
  const handleAddToCart = async (productId) => {
  try {
    const response = await addToCart({
      productId,
      quantity: 1,
    });
    await fetchCart();

    toast.success(response.message || "Product added to cart");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add product"
    );
  }
};
const handleAddToWishlist = async (productId) => {
  try {
    const response = await addToWishlist(productId);
    await fetchWishlist();

    toast.success(response.message || "Product added to wishlist");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add wishlist"
    );
  }
};
  return (
  <div className="products-page">
     <div className="product-header">
  <h1>Explore Our Products</h1>
  <p>
    Discover premium products carefully selected for you.
  </p>
</div>
   

    <div className="products-controls">
      <input
        type="text"
        placeholder="🔍 Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="">Sort By</option>
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
      </select>
    </div>

    <div className="products-grid">
      {
filteredProducts.length === 0 ? (

<div className="no-products">
  <h2>😕 No products found</h2>
  <p>Try another search keyword.</p>
</div>

) : (

      filteredProducts.map((product) => (

        <div className="product-card" key={product._id}>

          <div className="product-image">
            <span className="badge">New</span>

            <button className="wishlist-btn"
            onClick={()=>
              handleAddToWishlist(product._id)
            }>
              <FiHeart />
            </button>

            <img
              src={
                product.images?.length
                  ? product.images[0]
                  : "https://via.placeholder.com/300x300?text=No+Image"
              }
              alt={product.name}
            />
          </div>

          <div className="product-info">

            <h3>{product.name}</h3>

            <div className="rating">
              <FaStar />
              <span>4.5</span>
            </div>

            <h2>₹ {product.price}</h2>

            <div className="product-buttons">
              <button className="cart-btn"
              onClick={()=>
                handleAddToCart(product._id)
              }>
                <FiShoppingCart />
                Add to Cart
              </button>

              <button
  className="details-btn"
  onClick={() => navigate(`/products/${product._id}`)}
>
  View Details
</button>
            </div>

          </div>

        </div>

      ))
    )
      }

    </div>

  </div>
);
};

export default Products;