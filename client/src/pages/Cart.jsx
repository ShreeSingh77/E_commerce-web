import { useEffect,useState } from "react";
import { getCart ,updateCart,
  removeCartItem

 } from "../services/cartServices.js";
import "./Cart.css";
import toast from "react-hot-toast";
import {FiTrash2 } from "react-icons/fi";
import {useNavigate } from "react-router-dom";
import { applyCoupon } from "../services/couponService.js";


const Cart=()=>{
  const navigate = useNavigate();
     const [cart,setCart ]=useState([]);
     const [loading,setLoading] = useState(true);
      const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState("");
     useEffect(()=>{
        fetchCart();
      
        
     },[]);
     const fetchCart = async () => {
  try {
    const response = await getCart();
   
    console.log("fullname response",response);
    console.log("response data" ,response.data);
    
    setCart(response.data || []);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
const handleQuantity = async (cartId, quantity) => {
  try {
    await updateCart(cartId, quantity);

    fetchCart(); // Cart refresh ho jayega
  } catch (error) {
    console.log(error);
  }
};
const handleRemove = async (cartId) => {
  try {
    await removeCartItem(cartId);

    fetchCart();

    toast.success("Item removed from cart");
  } catch (error) {
    console.log(error);

    toast.error("Failed to remove item");
  }
};
const handleApplyCoupon = async () => {
  if (!couponCode.trim()) {
    toast.error("Please enter a coupon code");
    return;
  }

  try {
    const response = await applyCoupon(couponCode, subtotal);

    setDiscount(response.data.discountAmount);
    setFinalTotal(response.data.finalAmount);
    setAppliedCoupon(couponCode.toUpperCase());
   localStorage.setItem("couponCode",couponCode.toLocaleUpperCase());

   localStorage.setItem("finalTotal",response.data.finalAmount);
    toast.success(response.message || "Coupon Applied Successfully");

  } catch (error) {
    setDiscount(0);
    setFinalTotal(subtotal);
    setAppliedCoupon("");

     localStorage.removeItem("couponCode");
     localStorage.removeItem("finalTotal");

    toast.error(
      error.response?.data?.message || "Invalid Coupon"
    );
  }
};
const totalItems = cart.reduce(
  (acc, item) => acc + item.quantity,
  0
);

const subtotal = cart.reduce(
  (acc, item) => acc + item.product.price * item.quantity,
  0
);
useEffect(() => {
  setFinalTotal(subtotal);
}, [subtotal]);

if(loading){
    return <h1>Loading Cart.....</h1>;
}
if (!loading && cart.length === 0) {
  return (
    <div className="empty-cart">
      <h1>Your Cart is Empty 🛒</h1>
      <p>Add some products to continue shopping.</p>

      <button
        onClick={() => navigate("/products")}
        className="shop-btn"
      >
        Continue Shopping
      </button>
    </div>
  );
}
  return (
  <div className="cart-page">

    <div className="cart-left">

      <h1>Shopping Cart</h1>

      {cart.map((item) => (
        <div className="cart-card" key={item._id}>

          <img
            src={item.product.images[0]}
            alt={item.product.name}
          />
<div className="cart-info">
  <h2>{item.product.name}</h2>

  <p className="price">₹ {item.product.price}</p>

  <div className="cart-bottom">

    <div className="quantity-box">
      <button
        onClick={() => handleQuantity(item._id, item.quantity - 1)}
        disabled={item.quantity === 1}
      >
        -
      </button>

      <span>{item.quantity}</span>

      <button
        onClick={() => handleQuantity(item._id, item.quantity + 1)}
      >
        +
      </button>
    </div>

    <button
  className="remove-btn"
  onClick={() => handleRemove(item._id)}
>
  <FiTrash2 />
  <span>Remove</span>
</button>

  </div>
</div>

        </div>
      ))}

    </div>

    <div className="cart-right">
  <h2>Order Summary</h2>

  <div className="summary-row">
    <span>Total Items</span>
    <span>{totalItems}</span>
  </div>

  <div className="summary-row">
    <span>Subtotal</span>
    <span>₹ {subtotal}</span>
  </div>

   <div className="coupon-box">
  <input
    type="text"
    placeholder="Enter Coupon Code"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
  />

  <button onClick={handleApplyCoupon}>
    Apply
  </button>
</div>

{discount > 0 && (
  <div className="summary-row">
    <span>
      Coupon({appliedCoupon})
      </span>
    <span>Discount</span>
    <span>
      - ₹{discount.toFixed(2)}
      </span>
  </div>
)}
  <div className="summary-row">
    <span>Shipping</span>
    <span>Free</span>
  </div>

  <hr />

  <div className="summary-row total">
    <span>Total</span>
    <span>₹ {finalTotal.toFixed(2)}</span>
  </div>

  <button
  className="checkout-btn"
  onClick={() => navigate("/checkout")}
>
  Proceed to Checkout
</button>
</div>

  </div>
);
};


export default Cart;