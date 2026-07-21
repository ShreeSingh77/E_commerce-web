import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">E-Commerce</h2>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>

        <NavLink to="/products">Products</NavLink>

        <NavLink to="/cart">Cart</NavLink>

        <NavLink to="/wishlist">Wishlist</NavLink>

        <NavLink to="/login">Login</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;