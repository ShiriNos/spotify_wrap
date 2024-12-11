const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Authorization Step 1: Redirect to Spotify login
app.get('/login', (req, res) => {
    const scope = 'user-top-read user-read-recently-played';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    res.redirect(authUrl);
});

// Authorization Step 2: Exchange code for access token
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    try {
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
            },
            params: {
                code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
            },
        });
        res.json(tokenResponse.data);
    } catch (error) {
        console.error('Error exchanging code for token:', error.message);
        res.status(500).send('Authentication error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
