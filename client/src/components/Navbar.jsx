import { useState,useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {FiMenu,FiX, FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import { getCurrentUser } from "../services/profileService.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import "./Navbar.css";
import { getAllProducts } from "../services/productService.js";
const Navbar = () => {

   const [menuOpen , setMenuOpen] = useState(false);
    const {cart } =useCart();
    const {wishlist } =useWishlist();
  const navigate =useNavigate();



  const [searchOpen,setSearchOpen]=useState(false);
  const[search,setSearch] =useState("");
  const [debouncedSearch,setDebouncedSearch]=useState(search);
  const [suggestions,setSuggestions]=useState([]);

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

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);


useEffect(() => {

  const fetchSuggestions = async () => {

    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    try {

      const response = await getAllProducts({
        search,
        limit: 5,
      });

      setSuggestions(response.data.products || []);

    } catch (error) {
      console.log(error);
    }

  };

  const timer = setTimeout(fetchSuggestions, 300);

  return () => clearTimeout(timer);

}, [search]);
return (
  <nav className="navbar">

    <NavLink to="/" className="logo">
      <span>E</span>Commerce
    </NavLink>

    <button
      className="menu-btn"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      {menuOpen ? <FiX /> : <FiMenu />}
    </button>


    <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>

      <div className="nav-links">
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

  <NavLink 
    to="/wishlist" 
    className="icon-menu-item"
    onClick={() => setMenuOpen(false)}
  >
    <FiHeart />
    <span>Wishlist</span>
    {wishlist.length > 0 && (
      <span className="nav-badge">
        {wishlist.length}
      </span>
    )}
  </NavLink>


  <NavLink 
    to="/cart" 
    className="icon-menu-item"
    onClick={() => setMenuOpen(false)}
  >
    <FiShoppingCart />
    <span>Cart</span>
    {cart.length > 0 && (
      <span className="nav-badge">
        {cart.length}
      </span>
    )}
  </NavLink>


  <button className="icon-menu-item search-btn"
  onClick={()=>setSearchOpen(!searchOpen)}
  >
    <FiSearch />
    <span>Search</span>
  </button>

   {searchOpen && (
  <form
    className="search-box"
    onSubmit={(e)=>{
      e.preventDefault();

      if(search.trim()){
        navigate(`/products?search=${search}`);
        setSearch("");
        setSearchOpen(false);
      }
    }}
  >

    

  <input
  type="text"
  placeholder="🔍 Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Escape") {
      setSearch("");
      setSuggestions([]);
      setSearchOpen(false);
      
    }
  }}
/>

  {search.trim() && (
  <button
    type="button"
    className="search-close"
    onClick={() => {
      setSearch("");
      setSuggestions([]);
      setSearchOpen(false);
      navigate("/products");
    }}
  >
    <FiX />
  </button>
)}


     {suggestions.length > 0 && (

  <div className="search-suggestions">

    {suggestions.map((product) => (

      <div
        key={product._id}
        className="suggestion-item"
        onClick={() => {
          navigate(`/products/${product._id}`);
          setSearch("");
          setSuggestions([]);
          setSearchOpen(false);
          navigate(`/products?search=${encodeURIComponent(product.name)

          }`);
        }}
      >
        {product.name}
      </div>

    ))}

  </div>

)}
  </form>
)}
  <NavLink 
    to={isLoggedIn ? "/profile" : "/login"}
    className="icon-menu-item"
    onClick={() => setMenuOpen(false)}
  >
    <FiUser />
    <span>{isLoggedIn ? "Profile" : "Login"}</span>
  </NavLink>

</div>

    </div>

  </nav>
);
};

export default Navbar;