import { useEffect,useState } from "react";
import { getCart } from "../services/cartServices.js";







const Cart=()=>{
     const [cart,setCart ]=useState([]);
     const [loading,setLoading] = useState(true);
     useEffect(()=>{
        fetchCart();
     },[]);
     const fetchCart = async () => {
  try {
    const response = await getCart();

    console.log(response);

    setCart(response.data || []);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};
if(loading){
    return <h1>Loading Cart.....</h1>;
}
return (
  <div style={{ padding: "120px 8%" }}>
    <h1>My Cart</h1>
    <h2>Total Items: {cart.length}</h2>
  </div>
);
};


export default Cart;