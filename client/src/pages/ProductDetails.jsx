import { useEffect,useState } from "react";
import {useNavigate, useParams } from "react-router-dom"
import { getProductById,getAllProducts } from "../services/productService.js";
import "./ProductDetails.css"
import {FiShoppingCart} from "react-icons/fi"
import { addToCart } from "../services/cartServices.js";
import toast from "react-hot-toast";
const ProductDetails = () => {

  const { id } = useParams();
const [relatedProducts,setRelatedProducts] = useState([]);
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [quantity,setQuantity]=useState(1);
const navigate =useNavigate();
useEffect(() => {
  fetchProduct();
}, [id]);

const fetchProduct = async () => {
  try {
    // Current Product
    const response = await getProductById(id);
    setProduct(response.data);

    // All Products
    const allProducts = await getAllProducts();

    const related = allProducts.data.products
  .filter((item) => {
    return (
      item._id.toString() !== response.data._id.toString() &&
      item.category?._id?.toString() ===
        response.data.category?._id?.toString()
    );
  })
  .slice(0, 4);

setRelatedProducts(related);

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
if(loading){
  return <h1>Loading...</h1>
}
const handleAddToCart = async () => {
  try {
    const response = await addToCart({
      productId: product._id,
      quantity,
    });

    toast.success(response.message || "Product added to cart");
  } catch (error) {
  console.log(error.response);
  console.log(error.response?.data);

  toast.error(
    error.response?.data?.message || "Failed to add product"
  );
}
};
 return (
  <div className="product-details-page">

    <div className="product-details-container">

      <div className="product-left">
        <img
          src={product.images[0]}
          alt={product.name}
        />
      </div>

      <div className="product-right">

        <h1>{product.name}</h1>

        <div className="product-rating">
          ⭐⭐⭐⭐⭐ <span>(4.5)</span>
        </div>

        <h2>₹ {product.price}</h2>

        <p className="stock">
          Stock : {product.stock}
        </p>

        <p className="description">
          {product.description}
        </p>
         
         <div className="quantity-box">

  <button
    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
  >
    -
  </button>

  <span>{quantity}</span>

  <button
    onClick={() =>quantity < product.stock && setQuantity(quantity + 1)}
  >
    +
  </button>

</div>

<div className="details-buttons">

  <button
  className="add-cart-btn"
  onClick={handleAddToCart}
>
    <FiShoppingCart />
    Add to Cart
  </button>

  <button className="buy-btn">
    Buy Now
  </button>

</div>
      </div>

    </div>
     <div className="related-products">

  <h2>Related Products</h2>

  <div className="related-grid">

    {relatedProducts.map((item) => (

      <div
        className="related-card"
        key={item._id}
        onClick={() => navigate(`/products/${item._id}`)}
      >

        <img
          src={item.images[0]}
          alt={item.name}
        />

        <h3>{item.name}</h3>

        <p>₹ {item.price}</p>

      </div>

    ))}

  </div>

</div>
  </div>
);
  
};

export default ProductDetails;