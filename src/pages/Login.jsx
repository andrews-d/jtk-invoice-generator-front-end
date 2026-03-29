import { useState } from "react";
import { loginApi } from "../api/authService";
import { setToken } from "../helpers/storage";
import logo from "../assets/jtk-logo.png";

import "../styles/colors.css";
import "../styles/global.css";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   const res = await loginApi({ email, password });
    //   setToken(res.token);

    navigate("/invoices");
    // } catch (err) {
    //   alert(err.message || "Invalid credentials ❌");
    // }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={logo} alt="JTK Trans Logo" className="login-logo" />
          {/* <img
            src={comp_name}
            alt="JTK Trans Logo"
            className="login-comp-name"
          /> */}
        </div>
        {/* <h1 className="login-left-head-text">JTK Trans</h1>
        <p>
          Invoice generation and shipment tracking platform for logistics
          operations.
        </p> */}
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Login</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
