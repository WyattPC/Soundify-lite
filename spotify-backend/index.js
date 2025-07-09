require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
app.use(cors());
app.use(express.json());

// Load SSL certificate and key
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Spotify API credentials
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// Test route
app.get('/', (req, res) => {
  res.send('Spotify Backend Running (HTTPS)');
});

// /login route - redirects to Spotify's authorization page
app.get('/login', (req, res) => {
    const scope = 'user-read-recently-played';
    const authUrl = 'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri
      });
    res.redirect(authUrl);
  });

// /callback route - handles Spotify's redirect after user authorizes
app.get('/callback', (req, res) => {
    // Spotify will send a "code" query parameter here
    const code = req.query.code;
    if (!code) {
      return res.status(400).send('No code received from Spotify');
    }
    res.send(`Callback received! Authorization code: ${code}`);
  });

// Start HTTPS server
const PORT = process.env.PORT || 8888;
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});