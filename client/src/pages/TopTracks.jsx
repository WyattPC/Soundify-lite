import React, { useState } from "react";

// ⚠️ Use your own valid token from Spotify's console here for testing:
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
