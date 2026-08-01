import { useState } from "react";
import {
  FiGrid,
  FiMenu,
  FiX,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiLayers,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {

  const [menuOpen,setMenuOpen] = useState(false);
return (
  <>
    <button
      className="admin-menu-btn"
      onClick={() => setMenuOpen(true)}
    >
      <FiMenu />
    </button>

    {menuOpen && (
      <div
        className="admin-overlay"
        onClick={() => setMenuOpen(false)}
      />
    )}

    <aside
      className={`admin-sidebar ${
        menuOpen ? "show" : ""
      }`}
    >
      <button
        className="admin-close-btn"
        onClick={() => setMenuOpen(false)}
      >
        <FiX />
      </button>

      <h2 className="admin-logo">
        Admin Panel
      </h2>

      <nav>
        <NavLink
          to="/admin/dashboard"
          onClick={() => setMenuOpen(false)}
        >
          <FiGrid />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          onClick={() => setMenuOpen(false)}
        >
          <FiBox />
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          onClick={() => setMenuOpen(false)}
        >
          <FiShoppingCart />
          Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          onClick={() => setMenuOpen(false)}
        >
          <FiUsers />
          User
        </NavLink>

        <NavLink
          to="/admin/categories"
          onClick={() => setMenuOpen(false)}
        >
          <FiLayers />
          Categories
        </NavLink>

        <NavLink
          to="/admin/coupons"
          onClick={() => setMenuOpen(false)}
        >
          <FiTag />
          Coupons
        </NavLink>
       
        <NavLink to="/admin/settings">
          
           ⚙️ Settings
        </NavLink>
       
       
        
      </nav>
    </aside>
  </>
);
};

export default AdminSidebar;