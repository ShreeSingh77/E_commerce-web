import { useEffect,useState } from "react";
import { getWishlist,removeFromWishlist } from "../services/wishlistService";
import toast from "react-hot-toast";
import { addToCart } from "../services/cartServices";
import "./Wishlist.css";

const Wishlist = () => {

  const [wishlist,setWishlist] = useState([]);

  const fetchWishlist = async()=>{
    try{
      const response = await getWishlist();
      setWishlist(response.data || []);

    }catch(error){
      toast.error(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
const handleRemove = async(productId)=>{

  try{

    await removeFromWishlist(productId);

    toast.success("Product removed from wishlist");

    fetchWishlist();

  }catch(error){

    toast.error(
      error.response?.data?.message || 
      "Failed to remove product"
    );

  }

}
const handleMoveToCart = async(item)=>{

  try{

    // Add product to cart
    await addToCart({
productId:item.product._id,
quantity:1
    })


    // Remove from wishlist
    await removeFromWishlist(item._id);


    toast.success(
      "Product moved to cart"
    );


    // Refresh wishlist
    fetchWishlist();


  }catch(error){

    toast.error(
      error.response?.data?.message ||
      "Failed to move product to cart"
    );

  }

}

  useEffect(()=>{
    fetchWishlist();
  },[]);


  return (

    <div className="wishlist-page">

      <h1>My Wishlist ❤️</h1>


      {
        wishlist.length === 0 ? (

          <div className="empty-wishlist">
            <h2>Your wishlist is empty</h2>
            <p>
              Explore products and add your favorites.
            </p>
            <br/>
            <h4> [ Continue Shopping ]</h4>
          </div>

        ) : (

          <div className="wishlist-grid">

            {
              wishlist.map((item)=>(

                <div className="wishlist-card" key={item._id}>

                  <div className="wishlist-image">
                    <img 
                      src={item.product.images[0]}
                      alt={item.product.name}
                    />
                  </div>


                  <div className="wishlist-info">

                    <h3>
                      {item.product.name}
                    </h3>

                    <p className="price">
                      ₹{item.product.price}
                    </p>


                    <div className="wishlist-actions">

                      <button className="remove-btn"
                      onClick={()=>handleRemove(item._id)}
                      >
                        Remove
                      </button>

                      <button className="cart-btn"
                      
                      onClick={()=>handleMoveToCart(item)}>
                        Add To Cart
                      </button>

                    </div>

                  </div>


                </div>

              ))
            }

          </div>

        )
      }


    </div>

  )
}

export default Wishlist;