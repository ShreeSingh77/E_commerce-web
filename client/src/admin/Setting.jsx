import "./Admin.css";
import { useEffect,useState } from "react";
import { getCurrentUser} from "../services/profileService.js";
import { NavLink,Navigate, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";
import { updateProfile ,
  changePassword,
  logoutUser,
updateAvatar

} from "../services/profileService.js";
import { FiCamera } from "react-icons/fi";
import toast from "react-hot-toast";
const Settings = () => {
  const navigate =useNavigate();
  const [loading,setLoading] =useState(false);

  const [originalData,setOriginalData] = useState({});
    const [passwordData ,setPasswordData] = useState({

oldPassword:"",
newPassword:"",

confirmPassword:"",

    });
    const [formData, setFormData] = 
    useState ({
        fullName: "",
        username:"",
        email:"",
       role:"",
    });
 const [avatarFile, setAvatarFile] = useState(null);

    const avatarPreview = avatarFile
  ? URL.createObjectURL(avatarFile)
  : formData.avatar ||
    "https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&size=200";

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async () => {
  try {
    setLoading(true);
    if (avatarFile) {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  await updateAvatar(formData);
  await fetchUser();
}
    
    const res = await updateProfile({
  
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
    });
    setOriginalData({
  fullName: res.data.fullName,
  username: res.data.username,
  email: res.data.email,
});
    await fetchUser();
    toast.success(res.message || "Profile updated successfully");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
  finally{
    setLoading(false);
  }
};
const handlePasswordChange = async () => {
  try {

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      return toast.error("Please fill all fields");
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
  return toast.error("New Password and Confirm Password do not match");
}
    await changePassword(passwordData);

    toast.success("Password updated successfully");

    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to update password"
    );
  }
};
const handleLogout = async () => {
  try {
    await logoutUser();

    toast.success("Logged out successfully");

    navigate("/login");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Logout failed"
    );
  }
};

const fetchUser = async () => {
  try {
    const res = await getCurrentUser();

    setFormData({
  fullName: res.data.fullName,
  username: res.data.username,
  email: res.data.email,
  role: res.data.role,
  avatar: res.data.avatar,
  createdAt: res.data.createdAt,
  updatedAt: res.data.updatedAt,
});

setOriginalData({
  fullName: res.data.fullName,
  username: res.data.username,
  email: res.data.email,
});
  } catch (error) {
    console.log(error);
  }
};
   useEffect(() => {
  fetchUser();
}, []);

   const isProfileChanged =
  formData.fullName !== originalData.fullName ||
  formData.username !== originalData.username ||
  formData.email !== originalData.email ||
  avatarFile;

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
    src={
      avatarPreview
    }
    alt="Admin"
  />

  <label htmlFor="avatar-upload" className="camera-btn">
    <FiCamera />
  </label>

  <input
    id="avatar-upload"
    type="file"
    accept="image/*"
    hidden
    onChange={(e) =>{
      const file =e.target.files[0];

      console.log(file);
      setAvatarFile(e.target.files[0])}}
  />

</div>
    
   <div className="profile-title">
  <h3>Admin Profile</h3>

  <span className="role-pill">
    {formData.role}
  </span>
</div>
    <div className="settings-form">

      <input
        type="text"
        value={formData.fullName}
        name="fullName"
        onChange={handleChange}
      />

      <input
        type="text"
        value={formData.username}
        name="username"
      onChange={handleChange}
      />

      <input
      
        type="email"
        value={formData.email}
        name="email"
        onChange={handleChange}
      />

      <input
        type="text"
        name="role"
        value={formData.role}
      readOnly
        
      />
      
      <button className="profile-save-btn"
       onClick={handleSubmit}
       disabled={loading || !isProfileChanged}
       >
       {loading ? "Saving..." : "Save Changes"}
      </button>

    </div>

  </div>

  <div className="settings-card">

    <h3>Change Password</h3>

    <div className="settings-form">

      <input
  type="password"
  placeholder="Current Password"
  value={passwordData.oldPassword}
  onChange={(e) =>
    setPasswordData({
      ...passwordData,
      oldPassword: e.target.value,
    })
  }
/>

<input
  type="password"
  placeholder="New Password"
  value={passwordData.newPassword}
  onChange={(e) =>
    setPasswordData({
      ...passwordData,
      newPassword: e.target.value,
    })
  }
/>

      <input
        type="password"
        placeholder="Confirm Password"
      value={passwordData.confirmPassword}

      onChange={(e)=> setPasswordData({
        ...passwordData,
        confirmPassword:e.target.value,
      })
    }


      />
      <div className="profile-meta">
  <div>
    <span>Account Created</span>
    <strong>
      {formData.createdAt
        ? new Date(formData.createdAt).toLocaleDateString()
        : "-"}
    </strong>
  </div>

  <div>
    <span>Last Updated</span>
    <strong>
      {formData.updatedAt
        ? new Date(formData.updatedAt).toLocaleDateString()
        : "-"}
    </strong>
  </div>
</div>
      <button className="save-btn"
      onClick={handlePasswordChange}
      
      >
        Update Password
      </button>

    </div>

  </div>
   
   <div className="settings-card danger-card">
  <h3>Logout</h3>

  <p>
    Click the button below to securely logout from your admin account.
  </p>

  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
</div>
</div>
    </div>
  );
};

export default Settings;