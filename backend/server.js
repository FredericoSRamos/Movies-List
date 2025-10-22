const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const movieRoutes = require('./routes/movies');
const favoriteRoutes = require('./routes/favorites');

// Inicializa a aplicação Express
const app = express();

app.use(cors()); // Habilita o CORS para permitir requisições do front-end
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do desafio está no ar!');
});

app.use('/api/movies', movieRoutes);
app.use('/api/favorites', favoriteRoutes);

// Define a porta a partir das variáveis de ambiente ou usa 5000 como padrão
const PORT = process.env.PORT || 5000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});