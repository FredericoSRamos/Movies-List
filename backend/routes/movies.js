const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Rota para pesquisar filmes
// Ex: GET /api/movies/search?query=Inception
router.get('/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'O parâmetro de pesquisa é obrigatório.' });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
        language: 'pt-BR',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar filmes.' });
  }
});

// Rota para obter detalhes de um filme específico
// Ex: GET /api/movies/27205
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
            params: {
                api_key: API_KEY,
                language: 'pt-BR'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar detalhes do filme.' });
    }
});


module.exports = router;