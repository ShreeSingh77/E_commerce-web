import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";
import "./Login.css";

const Register = () => {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {

      const response = await registerUser({
        fullName,
        username,
        email,
        password,
      });

      toast.success(response.message || "Registration Successful");

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Registration Failed"
      );

    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Create Account</h1>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
};

export default Register;