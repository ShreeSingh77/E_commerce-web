import {
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiTag,
  FiLayers,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">

      <h2 className="admin-logo">
        Admin Panel
      </h2>

      <nav>

        <NavLink to="/admin/dashboard">
          <FiGrid />
          Dashboard
        </NavLink>

        <NavLink to="/admin/products">
          <FiBox />
          Products
        </NavLink>

        <NavLink to="/admin/orders">
          <FiShoppingCart />
          Orders
        </NavLink>

        <NavLink to="/admin/users">
          <FiUsers />
          Users
        </NavLink>

        <NavLink to="/admin/categories">
          <FiLayers />
          Categories
        </NavLink>

        <NavLink to="/admin/coupons">
          <FiTag />
          Coupons
        </NavLink>

      </nav>

    </aside>
  );
};

export default AdminSidebar;