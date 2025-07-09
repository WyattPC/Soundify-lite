import React, { useState } from "react";

// ⚠️ PASTE your Spotify OAuth token here (expires every hour)
const TOKEN = "BQASI__o4XbjYYmJxYPOxf_D4KGSdWbX2RWP55cAoZK9B9vulVI0I2miMxpZvCFSeOInNuLINrnWEz0tmkBdJatcXBoGtZDgaK4uDFEZrPw2MeeGNWiHqemzojrrO6Svs8j6f9-V9JDvbz8b03Imfw2FCKoZ-OMR8KvCJQ_LK4oSpG4CgE60RoqoW3-EXIjt1rT-NIWEqeCOKolv_XX-6kP2bNN_RLSArE5x6PEolibA37mZ3cPNRiMjsdL7ludJYMJzoJhjBrdibM0KtBQTJnlVl0KG2X5nGj_Evc59W04Fnu5M-gtDsAwUY2XyQ7rj";

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

export default function TopTracksAndSave() {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch top 5 tracks
  const getTopTracks = async () => {
    setLoading(true);
    setPlaylist(null);
    const data = await fetchWebApi(
      "v1/me/top/tracks?time_range=long_term&limit=5"
    );
    setTracks(data.items || []);
    setLoading(false);
  };

  // Create playlist and add tracks
  const savePlaylist = async () => {
    setSaving(true);

    // Get current user id
    const user = await fetchWebApi("v1/me", "GET");
    const userId = user.id;

    // Create new playlist
    const newPlaylist = await fetchWebApi(
      `v1/users/${userId}/playlists`,
      "POST",
      {
        name: "My Top Tracks Playlist",
        description: "Playlist created by React demo",
        public: false,
      }
    );

    // Add tracks to new playlist
    const tracksUri = tracks.map((t) => t.uri);
    await fetchWebApi(
      `v1/playlists/${newPlaylist.id}/tracks?uris=${tracksUri.join(",")}`,
      "POST"
    );

    setPlaylist(newPlaylist);
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24 }}>
      <h2>Your Top 5 Spotify Tracks</h2>
      <button onClick={getTopTracks} disabled={loading || tracks.length > 0}>
        {loading ? "Loading..." : "Get Top Tracks"}
      </button>

      {tracks.length > 0 && (
        <>
          <ul style={{ marginTop: 16 }}>
            {tracks.map((t) => (
              <li key={t.id}>
                <b>{t.name}</b> by {t.artists.map((a) => a.name).join(", ")}
              </li>
            ))}
          </ul>
          <button
            onClick={savePlaylist}
            disabled={saving}
            style={{ marginTop: 20 }}
          >
            {saving ? "Saving..." : "Save as Playlist"}
          </button>
        </>
      )}

      {playlist && (
        <div style={{ marginTop: 20, color: "green" }}>
          Playlist <b>{playlist.name}</b> created!<br />
          <a
            href={playlist.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open on Spotify
          </a>
        </div>
      )}
    </div>
  );
}
