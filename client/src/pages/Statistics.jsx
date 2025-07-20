import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Statistics.css';

export default function Statistics() {
  const [searchParams] = useSearchParams();
  const [recentTracks, setRecentTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [errorArtists, setErrorArtists] = useState(null);

  useEffect(() => {
    // Helper to get access token from URL or localStorage
    let accessToken = searchParams.get('access_token');
    if (!accessToken) {
      accessToken = localStorage.getItem('spotify_access_token');
    } else {
      localStorage.setItem('spotify_access_token', accessToken);
    }

    // Fetch recently played tracks
    const fetchRecentTracks = async () => {
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

    // Fetch top artists (last month)
    const fetchTopArtists = async () => {
      setLoadingArtists(true);
      setErrorArtists(null);
      if (!accessToken) {
        setErrorArtists('No access token found. Please login again.');
        setLoadingArtists(false);
        return;
      }
      try {
        const response = await fetch('https://127.0.0.1:8888/top-artists', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('spotify_access_token');
            setErrorArtists('Access token expired. Please login again.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data = await response.json();
          setTopArtists(data.items || []);
        }
      } catch (err) {
        console.error('Error fetching top artists:', err);
        setErrorArtists('Failed to load top artists. Please try again.');
      } finally {
        setLoadingArtists(false);
      }
    };

    fetchRecentTracks();
    fetchTopArtists();
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

          {/* Top Artists Section */}
          <div className="stats-section">
            <h3>Top 20 Artists (Last Month)</h3>
            {loadingArtists ? (
              <p>Loading top artists...</p>
            ) : errorArtists ? (
              <p className="text-red-400">{errorArtists}</p>
            ) : topArtists.length === 0 ? (
              <p>No top artists found.</p>
            ) : (
              <div className="artists-grid">
                {topArtists.map((artist, idx) => (
                  <div key={artist.id} className="artist-card">
                    <div className="artist-rank">#{idx + 1}</div>
                    <div className="artist-image">
                      {artist.images[0] && (
                        <img 
                          src={artist.images[0].url} 
                          alt={artist.name}
                          width="80"
                          height="80"
                        />
                      )}
                    </div>
                    <div className="artist-name">{artist.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Future API calls can be added here */}
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