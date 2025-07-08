import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import { useEffect, useState } from "react";

function AppWrapper() {
  const location = useLocation();

  // Simulated auth state
  const [user, setUser] = useState({
    username: "Wyatt" // 🔁 Change to null to test login version
  });

  // Show header on protected pages only
  const showHeader = ["/home", "/dashboard"].includes(location.pathname);

  return (
    <>
      {showHeader && <Header user={user} />} {/* 👈 Smart conditional header */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
