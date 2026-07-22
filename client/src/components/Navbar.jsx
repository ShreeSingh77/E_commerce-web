import { NavLink } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  return (
    <nav className="navbar">

      <NavLink to="/" className="logo">
        E-Commerce
      </NavLink>

      <div className="nav-links">

        {navLinks.map((link) => (
          <NavLink key={link.path} to={link.path}>
            {link.name}
          </NavLink>
        ))}

      </div>

      <div className="nav-icons">

        <NavLink to="/wishlist">
          <FiHeart />
        </NavLink>

        <NavLink to="/cart">
          <FiShoppingCart />
        </NavLink>

        <button className="search-btn">
          <FiSearch />
        </button>

        <NavLink to="/login">
          <FiUser />
        </NavLink>

      </div>

    </nav>
  );
};

export default Navbar;