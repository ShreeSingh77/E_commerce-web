import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService.js";
import toast from "react-hot-toast";
 import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = async (e) => {
  e.preventDefault();
  console.log("login button clicked");
  
  try {
    const response = await loginUser({
      email,
      password,
    });
  console.log(response);
  
    toast.success(response.message || "Login Successful");

    navigate("/");
  } catch (error) {
    console.log(error.response);
    console.log(error.response?.data);
    
    
    toast.error(
      error.response?.data?.message || "Login Failed"
    );
  }
};
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forgot-link">
            <Link to="/forgot-password">
            Forgot Password?
            </Link>
          </div>
          <p className="register-link">
  Don't have an account?{" "}
  <Link to="/register">
    Create Account
  </Link>
</p>
          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;