import React, { useState } from "react";

// ⚠️ Use your own valid token from Spotify's console here for testing:
const TOKEN = "BQCN_BptseoaxvLJ42aB7wTV7ZE0CV5yjIQpE9yeKC00zyee2Q0_-Qh6mBXJ3tcH0AePW9kfww1g5NG8JqZ7ihsptsuxMLSoWs9xgjjh2ee8xm4eLmxRKUlEUl1fuWSdLfuY5vLTiyH-j5laNTnQHbvnnoCzr3oFUWL8uVuigcScZd7_0xa0Xp_3e2MkGTSQHB3vwmpPoocGifFEMZBBzymgZ14eTFdsT2xv9eOYtlqX4gf9qEPaXvA47rmd43Vg87tBBv4TbQindjYkLgfI55tyFFWxEuwq_BGzGJj4xLygRHiBuQ90b3gp2nEvaqe8";

async function fetchWebApi(endpoint, method = "GET", body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  return await res.json();
}

export default function TopTracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTopTracks = async () => {
    setLoading(true);
    const data = await fetchWebApi(
      "v1/me/top/tracks?time_range=long_term&limit=5"
    );
    setTracks(data.items || []);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24 }}>
      <h2>Your Top 5 Spotify Tracks</h2>
      <button onClick={getTopTracks} disabled={loading}>
        {loading ? "Loading..." : "Get Top Tracks"}
      </button>
      <ul style={{ marginTop: 16 }}>
        {tracks.map((t) => (
          <li key={t.id}>
            <b>{t.name}</b> by {t.artists.map((a) => a.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
