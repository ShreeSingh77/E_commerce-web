import { useState } from "react";
import { forgotPassword } from "../services/profileService";
import toast from "react-hot-toast";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await forgotPassword({ email });

      toast.success(response.message || "Reset link sent successfully");

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="forgot-page">
      <form className="forgot-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>

        <p>
          Enter your registered email address to receive a password reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;