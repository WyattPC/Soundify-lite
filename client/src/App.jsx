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
    username: "Wyatt"
  });

  // Only show header on protected pages
  const showHeader = [ "/dashboard"].includes(location.pathname);

  return (
    <>
      {showHeader && <Header user={user} />}
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