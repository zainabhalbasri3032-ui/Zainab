import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("[127.0.0.1](http://127.0.0.1:5000/login)", {
        username,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("user", username);
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="login-container">
      <h2>Meeting Room Booking</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
