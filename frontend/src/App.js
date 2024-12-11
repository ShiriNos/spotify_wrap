import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
          <ul>
            {data.map((artist) => (
              <li key={artist.id}>{artist.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
