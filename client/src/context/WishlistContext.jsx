import { createContext, useContext, useEffect, useState } from "react";
import { getWishlist } from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlist(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);