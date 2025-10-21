import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/api/movies/search?query=${query}`);
      setMovies(response.data.results);
    } catch (err) {
      setError('Não foi possível buscar os filmes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lista de Filmes</h1>
        <SearchBar onSearch={searchMovies} />
      </header>
      <main>
        {loading && <p>Carregando...</p>}
        {error && <p className="error">{error}</p>}
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;