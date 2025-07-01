import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // if using styles here

function Header({ user }) {
  return (
    <header className="header">
      <h1 className="app-title">Soundify Lite</h1>

      <div className="top-right">
        {user && user.username ? (
          <button className="user-button">{user.username}</button>
        ) : (
          <Link to="/">
            <button className="login-button">Login</button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
