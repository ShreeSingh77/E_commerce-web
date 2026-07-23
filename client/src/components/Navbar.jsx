import { useState } from "react";
import { NavLink } from "react-router-dom";
import {FiMenu,FiX, FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
   const [menuOpen , setMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  return (
    <nav className="navbar">

      <NavLink to="/" className="logo">
        E-Commerce
      </NavLink>

 <button
  className="menu-btn"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? <FiX /> : <FiMenu />}
</button>
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
  {navLinks.map((link) => (
    <NavLink
      key={link.path}
      to={link.path}
      onClick={() => setMenuOpen(false)}
    >
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

        <button className="search-btn" type="button">
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