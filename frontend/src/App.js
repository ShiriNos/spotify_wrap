import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/login';
  };

  const handleCallback = async () => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
    if (code) {
      const tokenResponse = await axios.get(`http://localhost:5001/callback?code=${code}`);
      const accessToken = tokenResponse.data.access_token;
      getTopArtists(accessToken);
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);


  const getTopArtists = async (accessToken) => {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setData(response.data.items);
  };

  return (
    <div className="App">
      <button onClick={handleLogin}>Log in with Spotify</button>
      {data && (
        <div>
          <h1>Your Top Artists</h1>
          <div className="artist-grid">
            {data.map((artist, index) => (
              <div key={artist.id} className="artist-card">
                <span className="artist-rank">#{index + 1}</span>
                <img
                  src={artist.images[0]?.url || 'placeholder.jpg'}
                  alt={artist.name}
                  className="artist-image"
                />
                <h2 className="artist-name">{artist.name}</h2>
                <div className="artist-genres-container">
                  <p className="artist-genres">{artist.genres.slice(0, 1).join(', ')}...</p>
                  <div className="full-genres">{artist.genres.join(', ')}</div>
                </div>
                <p className="artist-popularity">Popularity: {artist.popularity}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
