import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../services/cartServices";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);