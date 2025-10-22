const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const favoritesDbPath = path.join(__dirname, '..', 'data', 'favorites.json');

// Função para ler o "banco de dados"
const readFavorites = () => {
  const data = fs.readFileSync(favoritesDbPath);
  return JSON.parse(data);
};

// Função para escrever no "banco de dados"
const writeFavorites = (data) => {
  fs.writeFileSync(favoritesDbPath, JSON.stringify(data, null, 2));
};

// POST /api/favorites/new - Cria uma nova lista de favoritos
router.post('/new', (req, res) => {
    const favorites = readFavorites();
    const newListId = uuidv4(); // Gera um ID único para a lista
    favorites[newListId] = []; // Inicia com uma lista vazia
    writeFavorites(favorites);
    res.status(201).json({ listId: newListId });
});

// GET /api/favorites/:listId - Obtém uma lista de favoritos
router.get('/:listId', (req, res) => {
    const favorites = readFavorites();
    const { listId } = req.params;
    if (favorites[listId]) {
        res.json(favorites[listId]);
    } else {
        res.status(404).json({ error: 'Lista de favoritos não encontrada.' });
    }
});

// POST /api/favorites/:listId/add - Adiciona um filme à lista
router.post('/:listId/add', (req, res) => {
    const { movie } = req.body;
    if (!movie || !movie.id) {
        return res.status(400).json({ error: 'Dados do filme são inválidos.' });
    }
    
    const favorites = readFavorites();
    const { listId } = req.params;

    if (!favorites[listId]) {
        return res.status(404).json({ error: 'Lista de favoritos não encontrada.' });
    }
    
    // Evita filmes duplicados
    if (!favorites[listId].some(m => m.id === movie.id)) {
        favorites[listId].push(movie);
        writeFavorites(favorites);
    }
    
    res.status(200).json(favorites[listId]);
});

// DELETE /api/favorites/:listId/remove/:movieId - Remove um filme da lista
router.delete('/:listId/remove/:movieId', (req, res) => {
    const favorites = readFavorites();
    const { listId, movieId } = req.params;

    if (!favorites[listId]) {
        return res.status(404).json({ error: 'Lista de favoritos não encontrada.' });
    }
    
    const initialLength = favorites[listId].length;
    favorites[listId] = favorites[listId].filter(m => m.id.toString() !== movieId);
    
    if (favorites[listId].length < initialLength) {
        writeFavorites(favorites);
        res.status(200).json(favorites[listId]);
    } else {
        res.status(404).json({ error: 'Filme não encontrado na lista de favoritos.' });
    }
});

module.exports = router;