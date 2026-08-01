import { useEffect,useRef, useState } from "react";
import {useNavigate} from "react-router-dom";
import { getCurrentUser,logoutUser,
  updateProfile ,
  changePassword,
updateAvatar,

} from "../services/profileService.js";
import {FiCamera} from "react-icons/fi";
import toast from "react-hot-toast";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar,setAvatar] =useState(null);
  const fileInputRef =useRef(null);
const [formData, setFormData] = useState({
  fullName: "",
  username: "",
  email: "",
});

useEffect(() => {
  if (user) {
    setFormData({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
    });
  }
}, [user]);
const [showPasswordForm, setShowPasswordForm] = useState(false);

const [passwordData, setPasswordData] = useState({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };
 const handleChangePassword = async () => {
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    await changePassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    });

    toast.success("Password changed successfully");

    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordForm(false);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to change password"
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
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleUpdate = async () => {
  try {
    const response = await updateProfile(formData);

    setUser(response.data);

    toast.success("Profile updated successfully");

    setIsEditing(false);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Update failed"
    );
  }
};

const handleAvatarUpload = async () => {
  if (!avatar) {
    toast.error("Please select an image");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("avatar", avatar);

    const response = await updateAvatar(formData);

    toast.success(response.message);

    fetchUser();

    setAvatar(null);

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Avatar upload failed"
    );
  }
};
const handlePasswordChange = (e) => {
  setPasswordData({
    ...passwordData,
    [e.target.name]: e.target.value,
  });
};
  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div style={{ padding: "120px 20px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

 return (
  <div className="profile-page">
    <div className="profile-card">

  <div className="profile-avatar">

  {user.avatar ? (
    <img
      src={user.avatar}
      alt={user.fullName}
      className="profile-avatar-img"
    />
  ) : (
    "👤"
  )}

  <button
    className="camera-btn"
    onClick={() => fileInputRef.current.click()}
  >
    <FiCamera />
  </button>

</div>


   <input
  ref={fileInputRef}
  className="avatar-input"
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatar(file);

    const formData = new FormData();
    formData.append("avatar", file);

    updateAvatar(formData)
      .then((response) => {
        toast.success(response.message);
        fetchUser();
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
          "Avatar upload failed"
        );
      });
  }}
/>

      <h2>{user.fullName}</h2>

      <p className="role">{user.role.toUpperCase()}</p>

      {isEditing ? (
        <>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
          />

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </>
      ) : (
        <div className="profile-info">
          <div className="info-row">
            <span>Username</span>
            <strong>{user.username}</strong>
          </div>

          <div className="info-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
        </div>
      )}

      {showPasswordForm && (
        <div className="password-form">

          <input
            type="password"
            name="oldPassword"
            placeholder="Current Password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />

          <button
            className="edit-btn"
            onClick={handleChangePassword}
          >
            Update Password
          </button>

          <button
            className="logout-btn"
            onClick={() => {
              setShowPasswordForm(false);
              setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
            }}
          >
            Cancel
          </button>

        </div>
      )}

      {!showPasswordForm && (
        <div className="profile-actions">

 {isEditing ? (
            <>
              <button
                className="edit-btn"
                onClick={handleUpdate}
              >
                Save Changes
              </button>

              <button
                className="password-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>

              <button
                className="password-btn"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </button>
            </>
          )}

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      )}

    </div>
  </div>
 );
};

export default Profile;