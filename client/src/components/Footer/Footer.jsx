import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-box">
          <h2 className="footer-logo">E-Commerce</h2>

          <p>
            Discover premium products with trusted quality, secure shopping,
            and fast delivery. Making your online shopping experience simple
            and enjoyable.
          </p>

          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedinIn />
          </div>
        </div>

        <div className="footer-box">
          <h3>Quick Links</h3>

          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Categories</a>
          <a href="#">Contact</a>
        </div>

        <div className="footer-box">
          <h3>Customer Service</h3>

          <a href="#">My Account</a>
          <a href="#">Orders</a>
          <a href="#">Wishlist</a>
          <a href="#">Help Center</a>
        </div>

        <div className="footer-box">
          <h3>Contact Us</h3>

          <p>📍 Lucknow, India</p>
          <p>📞 +91 9876543210</p>
          <p>✉ support@ecommerce.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 E-Commerce. All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;