import React, { useState } from 'react';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchMovies = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/movies/search?query=${query}`);
            setMovies(response.data.results);
        } catch (err) {
            setError('Não foi possível buscar os filmes. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const addToFavorites = async (movie) => {
        try {
            await api.post('/favorites/add', { movie });
            alert(`${movie.title} adicionado aos favoritos!`);
        } catch (err) {
            alert(err.response?.data?.error || "Erro ao adicionar o filme aos favoritos.");
        }
    };

    return (
        <div>
            <header className="App-header">
                <h2>Busque e Adicione Filmes à sua Lista</h2>
                <SearchBar onSearch={searchMovies} />
            </header>
            <main>
                {loading && <p>Carregando...</p>}
                {error && <p className="error">{error}</p>}
                <div className="movie-list">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onAddToFavorites={addToFavorites}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;