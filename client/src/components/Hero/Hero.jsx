import "./Hero.css";
import heroImg from "../../assets/heroImg.jpg";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">

        <div className="hero-text">
          <span className="hero-tag">
            🔥 New Collection 2026
          </span>

          <h1>
            Shop Smarter, <br />
            Live Better
          </h1>

          <p>
            Discover premium quality products at unbeatable prices.
            From fashion to electronics, everything you need is
            just one click away.
          </p>

          <div className="hero-buttons">
            <button className="shop-btn">Shop Now</button>
            <button className="explore-btn">Explore</button>
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImg} alt="Shopping Banner" />
        </div>

      </div>
    </section>
  );
};

export default Hero;