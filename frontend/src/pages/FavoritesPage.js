import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shareableLink, setShareableLink] = useState('');
    const listId = localStorage.getItem('favoritesListId');
    const baseURL = 'http://localhost:5000/api'

    const fetchFavorites = useCallback(async () => {
        if (!listId) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`${baseURL}/favorites/${listId}`);
            setFavorites(response.data);
            setShareableLink(`${window.location.origin}/shared/${listId}`);
        } catch (error) {
            console.error("Erro ao buscar favoritos:", error);
        } finally {
            setLoading(false);
        }
    }, [listId]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const removeFromFavorites = async (movieId) => {
        try {
            await axios.delete(`${baseURL}/favorites/${listId}/remove/${movieId}`);
            // Atualiza a lista após a remoção
            setFavorites(prevFavorites => prevFavorites.filter(movie => movie.id !== movieId));
        } catch (error) {
            alert("Erro ao remover o filme dos favoritos.");
        }
    };

    if (loading) return <p>Carregando seus favoritos...</p>;

    return (
        <div>
            <header className="App-header">
                <h1>Meus Filmes Favoritos</h1>
                 <p>
                    <a href="/">Voltar para a Busca</a>
                </p>
            </header>
            <main>
                {shareableLink && (
                    <div className="share-section">
                        <h3>Compartilhe sua lista!</h3>
                        <input type="text" value={shareableLink} readOnly />
                    </div>
                )}
                {favorites.length === 0 ? (
                    <p>Você ainda não adicionou nenhum filme aos favoritos.</p>
                ) : (
                    <div className="movie-list">
                        {favorites.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onRemoveFromFavorites={removeFromFavorites}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritesPage;