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
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
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
      
      // For now, just send the tokens as JSON
      // In a real app, you'd store these securely
      res.json({
        access_token,
        refresh_token,
        expires_in,
        message: 'Successfully authenticated with Spotify!'
      });
      
    } catch (error) {
      console.error('Token exchange error:', error.response?.data || error.message);
      res.status(400).json({
        error: 'Failed to exchange code for token',
        details: error.response?.data || error.message
      });
    }
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