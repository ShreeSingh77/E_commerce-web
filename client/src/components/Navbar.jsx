import { useState,useEffect } from "react";
import { NavLink } from "react-router-dom";
import {FiMenu,FiX, FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import { getCurrentUser } from "../services/profileService.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import "./Navbar.css";

const Navbar = () => {

   const [menuOpen , setMenuOpen] = useState(false);
    const {cart } =useCart();
    const {wishlist } =useWishlist();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    {name:"Orders",path:"/orders"},
  ];
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const checkUser = async () => {
    try {
      await getCurrentUser();
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  checkUser();
}, []);
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
        
        <NavLink to="/wishlist" className="icon-wrapper">
  <FiHeart />
  {wishlist.length > 0 && (
    <span className="nav-badge">{wishlist.length}</span>
  )}
</NavLink>

        <NavLink to="/cart" className="icon-wrapper">
  <FiShoppingCart />
  {cart.length > 0 && (
    <span className="nav-badge">{cart.length}</span>
  )}
</NavLink>

        <button className="search-btn" type="button">
          <FiSearch />
        </button>

        <NavLink to={isLoggedIn ? "/profile" : "/login"}>
  <FiUser />
</NavLink>

      </div>

    </nav>
  );
};

export default Navbar;