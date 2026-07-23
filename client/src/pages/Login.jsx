import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService.js";
import toast from "react-hot-toast";
 import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await loginUser({
      email,
      password,
    });

    toast.success(response.message || "Login Successful");

    navigate("/");
  } catch (error) {
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

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;