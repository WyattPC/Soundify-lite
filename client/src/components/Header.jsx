import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

export default function Header({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // If not logged in, redirect to login
    if (!user || !user.username) {
      navigate("/");
    }
  };

  return (
    <header className="header">
      <div className="logo">Soundify Lite</div>
      <button className="login-button" onClick={handleClick}>
        {user && user.username ? user.username : "Login"}
      </button>
    </header>
  );
}

