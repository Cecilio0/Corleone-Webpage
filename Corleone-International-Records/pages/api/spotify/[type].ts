// Archivo: pages/api/spotify/[type].ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  try {
    // Autenticación con la API de Spotify
    const authResponse = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials', 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        }
      }
    );

    const token = authResponse.data.access_token;
    

    // Obtener el ID del artista Chencho Corleone
    const searchResponse = await axios.get('https://api.spotify.com/v1/search?q=Chencho%20Corleone&type=artist', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const artistId = searchResponse.data.artists.items[0].id;

    // Realizar la solicitud a la API de Spotify
    let spotifyResponse;
    switch(type) {
      case 'songs':
        // Obtener las canciones populares de Chencho Corleone
        spotifyResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=ES`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        break;
      case 'albums':
        // Obtener los álbumes populares de Chencho Corleone
        spotifyResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=5&include_groups=album,appears_on`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        break;
      case 'artist':
        // Obtener información del artista Chencho Corleone
        spotifyResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        break;
      default:
        res.status(400).send('Tipo no válido');
        return;
    }

    console.log(spotifyResponse.data)
    res.status(200).json(spotifyResponse.data);
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
}