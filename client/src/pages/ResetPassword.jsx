import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./ResetPassword.css";

import { resetPassword } from "../services/profileService";
const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const response = await resetPassword(token, {
     newPassword,
    });

    toast.success(response.message || "Password Reset Successfully");

    navigate("/login");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Reset Failed"
    );
  }
};
  return (
    <div className="reset-page">
      <form className="reset-card" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;