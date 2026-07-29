import "./FeaturedCategories.css";
import fashion from "../../assets/categories/fashion.jpg";
import electronics from "../../assets/categories/electronics.jpg";
import beauty from "../../assets/categories/beauty.jpg";
import home from "../../assets/categories/home.jpg";
import {useNavigate} from "react-router-dom" ;


const categories = [
  {
    id: 1,
    name: "Fashion",
    image: fashion,
  },
  {
    id: 2,
    name: "Electronics",
    image: electronics,
  },
  {
    id: 3,
    name: "Beauty",
    image: beauty,
  },
  {
    id: 4,
    name: "Home & Kitchen",
    image: home,
  },
];

const FeaturedCategories = () => {
  const navigate =useNavigate();
  return (
    <section className="featured-categories">
      <div className="section-title">
        <span>Shop by Category</span>
        <h2>Featured Categories</h2>
        <p>
          Explore our carefully selected collections designed to match every
          lifestyle.
        </p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.id}>
            <div className="category-image">
              <img src={category.image} alt={category.name} />
            </div>

            <h3>{category.name}</h3>

            <button
            onClick={()=>navigate("/products")}
            >Shop Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;