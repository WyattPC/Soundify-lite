import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Statistics.css';

export default function Statistics() {
  const [searchParams] = useSearchParams();
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentTracks = async () => {
      // First, try to get token from URL parameters (new login)
      let accessToken = searchParams.get('access_token');
      
      // If no token in URL, try to get from localStorage
      if (!accessToken) {
        accessToken = localStorage.getItem('spotify_access_token');
      } else {
        // Store the token in localStorage for future use
        localStorage.setItem('spotify_access_token', accessToken);
      }
      
      if (!accessToken) {
        setError('No access token found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://127.0.0.1:8888/recently-played', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired, clear it and show error
            localStorage.removeItem('spotify_access_token');
            setError('Access token expired. Please login again.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setRecentTracks(data.items || []);
        }
      } catch (err) {
        console.error('Error fetching recent tracks:', err);
        setError('Failed to load recent tracks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTracks();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="statistics">
        <Sidebar />
        <div className="main-content">
          <div className="section">
            <h2>Loading your statistics...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics">
        <Sidebar />
        <div className="main-content">
          <div className="section">
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics">
      <Sidebar />
      <div className="main-content">
        <div className="section">
          <h2>Your Listening Statistics</h2>
          
          <div className="stats-section">
            <h3>Recently Played Tracks</h3>
            <div className="tracks-container">
              {recentTracks.length === 0 ? (
                <p>No recent tracks found.</p>
              ) : (
                recentTracks.map((item, index) => (
                  <div key={index} className="track-item">
                    <div className="track-image">
                      {item.track.album.images[0] && (
                        <img 
                          src={item.track.album.images[0].url} 
                          alt={item.track.album.name}
                          width="60"
                          height="60"
                        />
                      )}
                    </div>
                    <div className="track-info">
                      <h4>{item.track.name}</h4>
                      <p>{item.track.artists.map(artist => artist.name).join(', ')}</p>
                      <p className="track-album">{item.track.album.name}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Future API calls can be added here */}
          <div className="stats-section">
            <h3>Top Artists</h3>
            <p>Coming soon...</p>
          </div>

          <div className="stats-section">
            <h3>Top Tracks</h3>
            <p>Coming soon...</p>
          </div>

          <div className="stats-section">
            <h3>Listening History</h3>
            <p>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
} 