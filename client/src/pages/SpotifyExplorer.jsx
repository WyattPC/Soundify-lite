import React, { useEffect, useState } from "react";

const TOKEN = "BQASI__o4XbjYYmJxYPOxf_D4KGSdWbX2RWP55cAoZK9B9vulVI0I2miMxpZvCFSeOInNuLINrnWEz0tmkBdJatcXBoGtZDgaK4uDFEZrPw2MeeGNWiHqemzojrrO6Svs8j6f9-V9JDvbz8b03Imfw2FCKoZ-OMR8KvCJQ_LK4oSpG4CgE60RoqoW3-EXIjt1rT-NIWEqeCOKolv_XX-6kP2bNN_RLSArE5x6PEolibA37mZ3cPNRiMjsdL7ludJYMJzoJhjBrdibM0KtBQTJnlVl0KG2X5nGj_Evc59W04Fnu5M-gtDsAwUY2XyQ7rj";

async function getGenres() {
  const response = await fetch(
    "https://api.spotify.com/v1/browse/categories?locale=en_US",
    { headers: { Authorization: "Bearer " + TOKEN } }
  );
  const data = await response.json();
  return data.categories.items;
}

async function getPlaylists(genreId) {
  const response = await fetch(
    `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=10`,
    { headers: { Authorization: "Bearer " + TOKEN } }
  );
  const data = await response.json();
  return data.playlists.items;
}

async function getTracks(playlistId) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`,
    { headers: { Authorization: "Bearer " + TOKEN } }
  );
  const data = await response.json();
  return data.items;
}

async function getTrack(trackId) {
  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    { headers: { Authorization: "Bearer " + TOKEN } }
  );
  return response.json();
}

async function createPlaylist(tracks) {
  // Get user ID
  const userRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: "Bearer " + TOKEN }
  });
  const user = await userRes.json();
  if (!user.id) throw new Error("Invalid token for user requests");

  // Create playlist
  const playlistRes = await fetch(
    `https://api.spotify.com/v1/users/${user.id}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "My Explorer Playlist",
        description: "Playlist created from Spotify Explorer",
        public: false
      })
    }
  );
  const playlist = await playlistRes.json();

  // Add tracks
  const uris = tracks.map(t => t.track?.uri || t.uri).filter(Boolean);
  await fetch(
    `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?uris=${uris.join(",")}`,
    {
      method: "POST",
      headers: { Authorization: "Bearer " + TOKEN }
    }
  );

  return playlist;
}

export default function SpotifyExplorer() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [trackDetail, setTrackDetail] = useState(null);

  const [playlistResult, setPlaylistResult] = useState(null);
  const [playlistError, setPlaylistError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const gs = await getGenres();
      setGenres(gs);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (!selectedGenre) return;
    setPlaylists([]);
    setTracks([]);
    setSelectedPlaylist("");
    setTrackDetail(null);
    async function fetchPlaylists() {
      setLoading(true);
      const pls = await getPlaylists(selectedGenre);
      setPlaylists(pls);
      setLoading(false);
    }
    fetchPlaylists();
  }, [selectedGenre]);

  useEffect(() => {
    if (!selectedPlaylist) return;
    setTracks([]);
    setSelectedTrack(null);
    setTrackDetail(null);
    async function fetchTracks() {
      setLoading(true);
      const trs = await getTracks(selectedPlaylist);
      setTracks(trs);
      setLoading(false);
    }
    fetchTracks();
  }, [selectedPlaylist]);

  useEffect(() => {
    if (!selectedTrack) return;
    async function fetchTrackDetail() {
      setLoading(true);
      const td = await getTrack(selectedTrack);
      setTrackDetail(td);
      setLoading(false);
    }
    fetchTrackDetail();
  }, [selectedTrack]);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <h2>Spotify Explorer</h2>
      {loading && <div>Loading...</div>}

      <div style={{ marginBottom: 12 }}>
        <label>Genre:</label>
        <select
          value={selectedGenre}
          onChange={e => setSelectedGenre(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="">Select...</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {playlists.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <label>Playlists:</label>
          <select
            value={selectedPlaylist}
            onChange={e => setSelectedPlaylist(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="">Select...</option>
            {playlists.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {tracks.length > 0 && (
        <div>
          <h4>Tracks:</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tracks.map(t =>
              <li
                key={t.track.id}
                style={{ cursor: "pointer", margin: "5px 0" }}
                onClick={() => setSelectedTrack(t.track.id)}
              >
                {t.track.name}
              </li>
            )}
          </ul>
          {/* Create playlist button */}
          <button
            onClick={async () => {
              setSaving(true);
              setPlaylistError("");
              setPlaylistResult(null);
              try {
                const playlist = await createPlaylist(tracks);
                setPlaylistResult(playlist);
              } catch (err) {
                setPlaylistError(err.message);
              }
              setSaving(false);
            }}
            disabled={saving}
            style={{ margin: "12px 0" }}
          >
            {saving ? "Saving..." : "Create Playlist from Tracks"}
          </button>
          {playlistError && <div style={{ color: "red" }}>{playlistError}</div>}
          {playlistResult && (
            <div style={{ color: "green" }}>
              Playlist created! <b>{playlistResult.name}</b>
              <br />
              <a
                href={playlistResult.external_urls?.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open on Spotify
              </a>
            </div>
          )}
        </div>
      )}

      {trackDetail && (
        <div style={{ border: "1px solid #444", padding: 16, marginTop: 16 }}>
          <img
            src={trackDetail.album?.images?.[1]?.url}
            alt="track art"
            style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
          />
          <div style={{ marginTop: 8, fontWeight: "bold" }}>{trackDetail.name}</div>
          <div style={{ color: "#666" }}>
            {trackDetail.artists?.map(a => a.name).join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}