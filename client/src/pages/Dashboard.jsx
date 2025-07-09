import React from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

// Accept user as a prop (for possible future use)
export default function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        {/* <Header user={user} />  <-- REMOVED! */}

        <div className="section">
          <h2>THE BEST PLAYLISTS</h2>
          <div className="playlist-row">
            <div className="playlist-card">Pop Hits</div>
            <div className="playlist-card">Best of Metallica</div>
            <div className="playlist-card">80s Classic Hits</div>
            <div className="playlist-card">Best of 2025</div>
          </div>
        </div>

        <div className="section">
          <div className="tabs">
            <button>All</button>
            <button>Music</button>
            <button>Podcasts</button>
            <button>Audiobooks</button>
          </div>
          <div className="playlist-grid">
            <div className="playlist-tile">NEVER STOP</div>
            <div className="playlist-tile">New Years Refined</div>
            <div className="playlist-tile">Lofi beats to sleep to</div>
            <div className="playlist-tile">Tha Carter VI</div>
          </div>
        </div>

        <div className="section">
          <h2>Made For Wyatt</h2>
          <div className="playlist-row">
            <div className="playlist-card">Discover Weekly</div>
            <div className="playlist-card">Your Top Songs</div>
            <div className="playlist-card">Chill Mix</div>
            <div className="playlist-card">Daily Mix</div>
          </div>
        </div>
      </div>
    </div>
  );
}
