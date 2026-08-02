import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import "./Products.css";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import {useNavigate ,useLocation} from "react-router-dom"
import { addToCart } from "../services/cartServices.js";
import toast from "react-hot-toast";
import { addToWishlist } from "../services/wishlistService.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import {getAllCategories} from "../services/categoryServices.js";

const Products = () => {
  const navigate = useNavigate();
  const location =useLocation();
 const [search, setSearch] = useState("");
const [sort, setSort] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {fetchWishlist }=useWishlist();
  const {fetchCart } = useCart();
const [categories ,setCategories]=useState("");
const[category ,setCategory]= useState("");
const [price,setPrice]=useState("");

const [currentPage,setCurrentPage] =useState(1);
const [totalPages ,setTotalPages ] =useState(1);
 useEffect(() => {

  const query = new URLSearchParams(location.search);

  const searchQuery = query.get("search") || "";

  setSearch(searchQuery);

  fetchProducts(searchQuery);
   fetchCategories();
}, [location.search,category,price,currentPage]);

 const fetchProducts = async (searchQuery = "") => {
  try {
      let minPrice = "";
let maxPrice = "";

if (price === "under500") {
  maxPrice = 500;
} else if (price === "500to1000") {
  minPrice = 500;
  maxPrice = 1000;
} else if (price === "above1000") {
  minPrice = 1000;
}
    const response = await getAllProducts({
      search: searchQuery,
      category,
      minPrice,
      maxPrice,
      page:currentPage,
      limit:8,
    });

    setProducts(response.data.products || []);
     setCurrentPage(response.data.currentPage);
setTotalPages(response.data.totalPages);

  } catch (error) {

    console.log(error);

  } finally {

    setLoading(false);

  }
};
const fetchCategories = async () => {
  try {
    const response = await getAllCategories();
  
    
    setCategories(response.data || []);
  } catch (error) {
    console.log(error);
  }
};
  if (loading) {
    return <h2>Loading Products...</h2>;
  }

 
 const filteredProducts = [...products].sort((a, b) => {
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
  value={category}
  onChange={(e) => {setCategory(e.target.value);
    setCurrentPage(1);
  }
}
>
  <option value="">All Categories</option>

  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}

</select>
    <select
  value={price}
  onChange={(e) =>{ setPrice(e.target.value);
    setCurrentPage(1);
  }
  }
>
  <option value="">All Prices</option>
  <option value="under500">Under ₹500</option>
  <option value="500to1000">₹500 - ₹1000</option>
  <option value="above1000">Above ₹1000</option>
</select>

      <select
        value={sort}
        onChange={(e) => {setSort(e.target.value);
          setCurrentPage(1);
        }
        }
      >
        <option value="">Sort By</option>
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
      </select>

      <button
  className="clear-filter-btn"
  onClick={() => {
    setSearch("");
    setCategory("");
    setPrice("");
    setSort("");
    navigate("/products");
  }}
>
  Clear Filters
</button>
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
  <span>{product.averageRating || 0}</span>
  <small>({product.totalReviews || 0})</small>
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
    <div className="pagination">

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
  >
    ⬅ Previous
  </button>

  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index + 1}
      className={currentPage === index + 1 ? "active-page" : ""}
      onClick={() => setCurrentPage(index + 1)}
    >
      {index + 1}
    </button>
  ))}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => prev + 1)}
  >
    Next ➡
  </button>

</div>
  </div>
);
};

export default Products;