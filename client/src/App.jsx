import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import HomePage from "./pages/HomePage";
import SpotifyExplorer from "./pages/SpotifyExplorer";
import TopTracksAndSave from "./pages/TopTracksAndSave";
import Header from "./components/Header";
import TopTracks from "./pages/TopTracks";
import { useEffect, useState } from "react";
import { Result } from "postcss";

function AppWrapper() {
  const location = useLocation();

  // Simulated auth state
  const [user, setUser] = useState({
    username: null // 🔁 Change to null to test login version
  });

  // Show header on protected pages only
  const showHeader = ["/home", "/dashboard", "/statistics"].includes(location.pathname);

  return (
    <>
      {showHeader && <Header user={user} />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Pass user prop to Dashboard */}
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/SpotifyExplorer" element={<SpotifyExplorer/>}/>
        <Route path="/top-tracks-save" element={<TopTracksAndSave />} />
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

