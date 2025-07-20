require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');

var app = express();
app.use(cors());
app.use(express.json());

// Load SSL certificate and key
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Spotify API credentials
var client_id = 'd0df5ff8ff4e4eb5ac876ab7c212873a';
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var redirect_uri = 'https://127.0.0.1:8888/callback';

// Test route
app.get('/', (req, res) => {
  res.send('Spotify Backend Running (HTTPS)');
});

// Helper function to generate random string
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// /login route - redirects to Spotify's authorization page
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-read-recently-played user-top-read';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true
    }));
});

// /callback route - handles Spotify's redirect and exchanges code for token
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' + querystring.stringify({
      error: 'state_mismatch'
    }));
  } else {
    try {
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: querystring.stringify({
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        })
      };

      const response = await axios(authOptions);
      
      // Success! You now have an access token
      const { access_token, refresh_token, expires_in } = response.data;
      
      // Log the access token to console for testing purposes
      console.log('=== ACCESS TOKEN FOR TESTING ===');
      console.log('Access Token:', access_token);
      console.log('Refresh Token:', refresh_token);
      console.log('Expires In:', expires_in);
      console.log('================================');
      
      // For now, just send the tokens as JSON
      // In a real app, you'd store these securely
      res.redirect(`http://localhost:5173/statistics?access_token=${access_token}`);
      
    } catch (error) {
      console.error('Token exchange error:', error.response?.data || error.message);
      res.status(400).json({
        error: 'Failed to exchange code for token',
        details: error.response?.data || error.message
      });
    }
  }
});

// Endpoint to get the user's last 50 played tracks
app.get('/recently-played', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const access_token = authHeader.split(' ')[1];

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recently played tracks:', error.response?.data || error.message);
    res.status(400).json({
      error: 'Failed to fetch recently played tracks',
      details: error.response?.data || error.message
    });
  }
});

// Endpoint to get the user's top 20 artists from the last month
app.get('/top-artists', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const access_token = authHeader.split(' ')[1];

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=short_term', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching top artists:', error.response?.data || error.message);
    res.status(400).json({
      error: 'Failed to fetch top artists',
      details: error.response?.data || error.message
    });
  }
});

// Start HTTPS server
const PORT = process.env.PORT || 8888;
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});

console.log('Loaded ENV:', {
  client_id,
  client_secret: client_secret ? '***' : undefined,
  redirect_uri
});