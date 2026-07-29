import "./Checkout.css";
import { useEffect,useState } from "react";
import { getAddresses ,addAddress} from "../services/addressService";
import toast from "react-hot-toast";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { getCart } from "../services/cartServices.js";
import { useCart } from "../context/CartContext.jsx";


const Checkout = () => {
  const {fetchCart:refreshCart}=useCart();
  const [addresses, setAddresses] = useState([]);
 const [showForm,setShowForm]=useState(false);
 const [fullName, setFullName] = useState("");
const [phone, setPhone] = useState("");
const [addressLine1, setAddressLine1] = useState("");
const [addressLine2, setAddressLine2] = useState("");
const [city, setCity] = useState("");
const [state, setState] = useState("");
const [postalCode, setPostalCode] = useState("");

const navigate = useNavigate();
const [cart,setCart]= useState([]);
const [selectedAddress, setSelectedAddress] = useState(null);
const [cartItems, setCartItems] = useState([]);
const [loading, setLoading] = useState(false);
const [couponCode,setCouponCode] =useState("");
const [discount, setDiscount] = useState(0);
const [finalTotal, setFinalTotal] = useState(0);
const [appliedCoupon, setAppliedCoupon] = useState("");

useEffect(() => {
  fetchAddresses();
  fetchCart();
  
}, []);

const fetchAddresses = async () => {

  try {
    const response = await getAddresses();
   console.log("Add response",response);
   
   const addressList = response.data || [];
   
   console.log("ADDRESS LIST",addressList);
   
setAddresses(addressList);

const defaultAddress = addressList.find(
  (address) => address.isDefault
);

if (defaultAddress) {
  setSelectedAddress(defaultAddress._id);
}
  } catch (error) {
    console.log(error);
  }
};
const handleSaveAddress = async () => {
  try {
    const response = await addAddress({
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
    });

    toast.success(response.message || "Address Added Successfully");

     

     await fetchAddresses();
    setShowForm(false);

    setFullName("");
    setPhone("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add address"
    );
  }
};

const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    toast.error("Please select a delivery address");
    return;
  }

  try {
   const couponCode = localStorage.getItem("couponCode");

const response = await createOrder(
  selectedAddress,
  couponCode
);
    await refreshCart();
    toast.success(response.message || "Order Placed Successfully");

     localStorage.removeItem("couponCode");
     localStorage.removeItem("finalTotal");
    navigate("/orders");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to place order"
    );
  }
};
const fetchCart = async () => {
  try {
    setLoading(true);

    const response = await getCart();
    console.log("cart responce",response);
    console.log("cart items",cartItems);
    
    setCartItems(response.data || []);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
const subtotal = cartItems.reduce(
  (total, item) => total + item.product.price * item.quantity,
  0
);
useEffect(() => {
  const savedCoupon = localStorage.getItem("couponCode");
  const savedFinalTotal = localStorage.getItem("finalTotal");

  if (savedCoupon) {
    setAppliedCoupon(savedCoupon);
  }

  if (savedFinalTotal) {
    setFinalTotal(Number(savedFinalTotal));
    setDiscount(subtotal - Number(savedFinalTotal));
  } else {
    setFinalTotal(subtotal);
    setDiscount(0);
  }
}, [subtotal]);
const totalItems = cartItems.reduce(
  (total, item) => total + item.quantity,
  0
);


  return (
    <div className="checkout-page">

      <div className="checkout-left">

        <h2>Delivery Address</h2>

       {addresses.map((address) => (
  <div
  className={`saved-address-card ${
    selectedAddress === address._id ? "selected-address" : ""
  }`}
  key={address._id}
>
    <h3>{address.fullName}</h3>

    <p>{address.phone}</p>

    <p>
      {address.addressLine1}
      {address.addressLine2 && `, ${address.addressLine2}`}
    </p>

    <p>
      {address.city}, {address.state} - {address.postalCode}
    </p>

    <p>{address.country}</p>

    {address.isDefault && (
      <span className="default-badge">Default</span>
    )}

   <button
  className="select-btn"
  onClick={() => setSelectedAddress(address._id)}
>
  {selectedAddress === address._id
    ? "✓ Selected"
    : "Select Address"}
</button>


  </div>
  
))}
<button
  className="add-address-btn"
  onClick={() => setShowForm(!showForm)}
>
  {showForm ? "Cancel" : "+ Add New Address"}
</button>
      {showForm && (
  <div className="address-card">


    <input
      type="text"
      placeholder="Full Name"
      value={fullName}
      onChange={(e)=>
        setFullName(e.target.value)
      }
    />

    <input
      type="text"
      placeholder="Phone Number"
      value={phone}
      onChange={(e)=>
        setPhone(e.target.value)}
    />

    <textarea
      placeholder="Address Line 1"
      value={addressLine1}
      onChange={(e)=>
        setAddressLine1(e.target.value)
      }
    />
      <textarea
      placeholder="Address Line 2"
      value={addressLine2}
      onChange={(e)=>
        setAddressLine2(e.target.value)
      }
    />
    <input
      type="text"
      placeholder="City"
      value={city}
      onChange={(e)=>
        setCity(e.target.value)
      }
    />

    <input
      type="text"
      placeholder="State"
      value={state}
      onChange={(e)=>
        setState(e.target.value)
      }
    />

    <input
      type="text"
      placeholder="Pincode"
      value={postalCode}
      onChange={(e)=>
        setPostalCode(e.target.value)
      }
    />

    <button className="save-address-btn"
    onClick={handleSaveAddress}
    >
      Save Address
    </button>

  </div>
)}

      </div>

      <div className="checkout-right">

        <h2>Order Summary</h2>

       

<div className="summary-row">
  <span>Total Items</span>
  <span>{totalItems}</span>
</div>

<div className="summary-row">
  <span>Subtotal</span>
  <span>₹{subtotal.toFixed(2)}</span>
</div>

{appliedCoupon && (
  <div className="summary-row">
    <span>Coupon ({appliedCoupon})</span>
    <span>- ₹{discount.toFixed(2)}</span>
  </div>
)}

<div className="summary-row">
  <span>Shipping</span>
  <span>FREE</span>
</div>

<hr />

<div className="summary-row total">
  <span>Total</span>
  <span>₹{finalTotal.toFixed(2)}</span>
</div>

<button
  className="place-order-btn"
  onClick={handlePlaceOrder}
>
  Place Order
</button>

      </div>

    </div>
  );
};

export default Checkout;