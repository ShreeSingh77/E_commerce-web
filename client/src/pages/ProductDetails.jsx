import { useEffect,useState } from "react";
import {useParams } from "react-router-dom"
import { getProductById } from "../services/productService.js";
import "./ProductDetails.css"
import {FiShoppingCart} from "react-icons/fi"
import { addToCart } from "../services/cartServices.js";
import toast from "react-hot-toast";
const ProductDetails = () => {

  const { id } = useParams();

const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [quantity,setQuantity]=useState(1);
useEffect(() => {
  fetchProduct();
}, []);

const fetchProduct = async () => {
  try {
    const response = await getProductById(id);
    console.log(response);

    setProduct(response.data);
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

  </div>
);
  
};

export default ProductDetails;