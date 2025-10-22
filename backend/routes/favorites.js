const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/autheticateToken');

// GET /api/favorites - Obtém os favoritos do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const favorites = await db('favorite_movies').where({ user_id: req.user.id });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar favoritos.' });
  }
});

// POST /api/favorites/add - Adiciona um filme aos favoritos do usuário
router.post('/add', authenticateToken, async (req, res) => {
  const { movie } = req.body;
  
  if (!movie || !movie.id) {
    return res.status(400).json({ error: 'Dados do filme são inválidos.' });
  }
  
  const favoriteMovie = {
    user_id: req.user.id,
    movie_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
  };

  try {
    await db('favorite_movies').insert(favoriteMovie);
    res.status(201).json(favoriteMovie);
  } catch (error) {
     if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ error: 'Este filme já está nos seus favoritos.' });
    }
    res.status(500).json({ error: 'Erro ao adicionar aos favoritos.' });
  }
});

// DELETE /api/favorites/remove/:movieId - Remove um filme dos favoritos do usuário
router.delete('/remove/:movieId', authenticateToken, async (req, res) => {
  const { movieId } = req.params;
  
  try {
    const deletedCount = await db('favorite_movies')
      .where({ user_id: req.user.id, movie_id: movieId })
      .del();

    if (deletedCount > 0) {
      res.status(200).json({ message: 'Filme removido dos favoritos.' });
    } else {
      res.status(404).json({ error: 'Filme não encontrado nos favoritos.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover dos favoritos.' });
  }
});

// Rota pública para compartilhamento
// GET /api/favorites/public/:userId
router.get('/public/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await db('favorite_movies').where({ user_id: userId });
    const user = await db('users').where({ id: userId }).first('username');

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ username: user.username, favorites });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar lista pública de favoritos.' });
  }
});

module.exports = router;