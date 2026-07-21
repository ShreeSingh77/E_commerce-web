import "./FeaturedCategories.css";
import fashion from "../../assets/categories/fashion.jpg";
import electronics from "../../assets/categories/electronics.jpg";
import beauty from "../../assets/categories/beauty.jpg";
import home from "../../assets/categories/home.jpg";

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
  return (
    <section className="featured-categories">
      <h2>Featured Categories</h2>

      <div className="category-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.id}>
            <img src={category.image} alt={category.name} />
            <h3>{category.name}</h3>
            <button>Shop Now</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;