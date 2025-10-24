import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { useNotification } from '../hooks/useNotification';

const HomePage = ({ isAuthenticated }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { addNotification } = useNotification();

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
        if (isAuthenticated) {
            try {
                await api.post('/favorites/add', { movie });
                addNotification(`${movie.title} adicionado aos favoritos!`, 'success');
            } catch (err) {
                addNotification(err.response?.data?.error || "Erro ao adicionar o filme.", 'error');
            }
        } else {
            addNotification('Você precisa fazer login para adicionar filmes aos favoritos.', 'info');
            navigate('/login');
        }
    };

    return (
        <div>
            <header className="App-header">
                <h2>Busque por Filmes</h2>
                <p>Encontre informações sobre qualquer filme e adicione os seus favoritos à sua lista pessoal.</p>
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