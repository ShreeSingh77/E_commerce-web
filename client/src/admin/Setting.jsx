import "./Admin.css";
import { FiGrid, FiBox,
     FiShoppingCart, FiUsers,
     FiLayers, FiTag } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";
const Settings = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
      <div className="admin-header">
        <div>
          <h2>⚙️ Settings</h2>
          <p>Manage your account settings</p>
        </div>
      </div>

      <div className="settings-grid">

  <div className="settings-card">

    <div className="settings-avatar">
      <img
        src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&size=200"
        alt="Admin"
      />
    </div>

    <h3>Admin Profile</h3>

    <div className="settings-form">

      <input
        type="text"
        placeholder="Full Name"
      />

      <input
        type="text"
        placeholder="Username"
      />

      <input
        type="email"
        placeholder="Email"
      />

      <input
        type="text"
        value="Admin"
        readOnly
      />

      <button className="save-btn">
        Save Changes
      </button>

    </div>

  </div>

  <div className="settings-card">

    <h3>Change Password</h3>

    <div className="settings-form">

      <input
        type="password"
        placeholder="Current Password"
      />

      <input
        type="password"
        placeholder="New Password"
      />

      <input
        type="password"
        placeholder="Confirm Password"
      />

      <button className="save-btn">
        Update Password
      </button>

    </div>

  </div>

</div>
</div>
    </div>
  );
};

export default Settings;