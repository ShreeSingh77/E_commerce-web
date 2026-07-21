import "./Home.css";
import FeaturedCategories from "../components/home/FeaturedCategories.jsx"
import FeaturedProducts from "../components/FeaturedProducts/FeaturedProducts.jsx";
import Features from "../components/Features/Features.jsx";
import Footer from "../components/Footer/Footer.jsx";
import Hero from "../components/Hero/Hero.jsx";
const Home = () => {
  return (
    <div className="home">
      <Hero />
       <FeaturedCategories />
       <FeaturedProducts />
       <Features />
       <Footer />
    </div>
    
  );
};




export default Home;