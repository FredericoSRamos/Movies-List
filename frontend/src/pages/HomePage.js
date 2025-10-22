import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';

// Hook para gerenciar o ID da lista de favoritos no localStorage
const useFavoritesList = () => {
    const [listId, setListId] = useState(localStorage.getItem('favoritesListId'));

    useEffect(() => {
        const createList = async () => {
            if (!listId) {
                const response = await axios.post('http://localhost:5000/api/favorites/new');
                console.log(response.data);
                localStorage.setItem('favoritesListId', response.data.listId);
                setListId(response.data.listId);
            }
        };
        createList();
    }, [listId]);

    return listId;
};


const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const listId = useFavoritesList();
    const baseURL = 'http://localhost:5000/api'

    const searchMovies = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${baseURL}/movies/search?query=${query}`);
            setMovies(response.data.results);
        } catch (err) {
            setError('Não foi possível buscar os filmes. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const addToFavorites = async (movie) => {
        if (!listId) {
            alert("Não foi possível encontrar sua lista de favoritos.");
            return;
        }
        try {
            await axios.post(`${baseURL}/favorites/${listId}/add`, { movie });
            alert(`${movie.title} adicionado aos favoritos!`);
        } catch (err) {
            alert("Erro ao adicionar o filme aos favoritos.");
        }
    };

    return (
        <div>
            <header className="App-header">
                <h1>Busca de Filmes</h1>
                <p>
                    <a href="/favorites">Ver Meus Favoritos</a>
                </p>
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