import { useEffect,useState } from "react";
import {useNavigate, useParams } from "react-router-dom"
import { getProductById,getAllProducts } from "../services/productService.js";
import "./ProductDetails.css"
import {FiShoppingCart} from "react-icons/fi"
import { addToCart } from "../services/cartServices.js";
import toast from "react-hot-toast";
import {getCurrentUser } from "../services/profileService.js";
import {useCart } from "../context/CartContext.jsx";
import { getReviews,
  addReview,
updateReview,
deleteReview,
 } from "../services/reviewService.js";
const ProductDetails = () => {
  const {fetchCart} =useCart();
  const { id } = useParams();
const [relatedProducts,setRelatedProducts] = useState([]);
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [quantity,setQuantity]=useState(1);


const [reviews,setReviews]=useState([]);
const [rating,setRating]=useState(5);
const[comment,setComment] =useState("");
const [currentUser,setCurrentUser] =useState(null);
const [editingReviewId, setEditingReviewId] = useState(null);
const [editRating, setEditRating] = useState(5);
const [editComment, setEditComment] = useState("");

const navigate =useNavigate();



useEffect(() => {
  fetchProduct();
  fetchReviews();
  fetchCurrentUser();
}, [id]);
const fetchCurrentUser = async () => {
  try {
    const response = await getCurrentUser();
    console.log(currentUser);
    
    setCurrentUser(response.data);
  } catch (error) {
    console.log(error);
  }
};
const fetchReviews = async () => {
  try {
    const response = await getReviews(id);

    console.log(response);
    setReviews(response.data || []);
  } catch (error) {
    console.log(error);
  }
};
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
const handleSubmitReview = async () => {
  try {
    const response = await addReview({
      productId: product._id,
      rating,
      comment,
    });

    toast.success(response.message || "Review added successfully");

    setRating(5);
    setComment("");

    fetchReviews();
    fetchProduct();

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to add review"
    );
  }
};
const handleEditReview = (review) => {
  setEditingReviewId(review._id);
  setEditRating(review.rating);
  setEditComment(review.comment);
};

const handleDeleteReview = async (reviewId) => {
  try {
    const response = await deleteReview(reviewId);

    toast.success(
      response.message || "Review deleted successfully"
    );

    fetchReviews();
    fetchProduct();

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to delete review"
    );
  }
};
const handleUpdateReview = async () => {
  try {
    const response = await updateReview(
      editingReviewId,
      {
        rating: editRating,
        comment: editComment,
      }
    );

    toast.success(
      response.message || "Review updated successfully"
    );

    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");

    fetchReviews();
    fetchProduct();

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to update review"
    );
  }
};
const handleAddToCart = async () => {
  try {
    const response = await addToCart({
      productId: product._id,
      quantity,
    });
   await fetchCart();
   
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
  ⭐ {product.averageRating || 0}
  <span> ({product.totalReviews || 0} Reviews)</span>
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


    <div className="review-section">

  <h2>Write a Review</h2>

  <div className="rating-select">

    <label>Rating</label>

    <select
  value={editingReviewId ? editRating : rating}
  onChange={(e) =>
    editingReviewId
      ? setEditRating(Number(e.target.value))
      : setRating(Number(e.target.value))
  }
>
      <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
      <option value={4}>⭐⭐⭐⭐ (4)</option>
      <option value={3}>⭐⭐⭐ (3)</option>
      <option value={2}>⭐⭐ (2)</option>
      <option value={1}>⭐ (1)</option>
    </select>

  </div>

 <textarea
  placeholder="Write your review..."
  value={editingReviewId ? editComment : comment}
  onChange={(e) =>
    editingReviewId
      ? setEditComment(e.target.value)
      : setComment(e.target.value)
  }
/>

  <button className="review-btn"
  onClick={
    editingReviewId
    ?handleUpdateReview
    :handleSubmitReview
  }
  >
  {
    editingReviewId
    ?"Update Review"
    :"submit Review"
  }
  </button>

</div>
<div className="reviews-list">
  <h2>Customer Reviews</h2>

  {reviews.length === 0 ? (
    <p>No reviews yet.</p>
  ) : (
    reviews.map((review) => (
      <div className="review-card" key={review._id}>
        <h4>{review.user.fullName}</h4>

        <p>
          ⭐ {review.rating}/5
        </p>

        <p>{review.comment}</p>
         {currentUser && review.user._id === currentUser._id && (
  <div className="review-actions">

    <button
      onClick={() => handleEditReview(review)}

>
      Edit
    </button>

    <button
      onClick={() => handleDeleteReview(review._id)}
    >
      Delete
    </button>

  </div>
)}
      </div>
    ))
  )}
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