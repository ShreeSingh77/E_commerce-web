import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="category">{product.category}</p>

        <h4>₹{product.price}</h4>

        <button>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;